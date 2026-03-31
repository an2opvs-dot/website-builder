import { useState } from 'react';
import { X, Globe, Copy, Check, ExternalLink, Download, GitPullRequest } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Octokit } from '@octokit/rest';
import './Modal.css';

const exportToHtml = (pageNodes, bodyBg = '#ffffff') => {
  let content = '';
  pageNodes.forEach(node => {
     const c = node.content || {};
     if(node.type === 'hero') {
       content += `\n    <section style="padding: 60px 20px; text-align: center; background-color: ${c.bgColor || '#f8f9fa'}">\n      <h1 style="font-size: 2.5rem; margin-bottom: 16px">${c.title || ''}</h1>\n      <p style="color: #666; max-width: 600px; margin: 0 auto">${c.subtitle || ''}</p>\n    </section>`;
     }
     if(node.type === 'contact') {
       content += `\n    <section style="padding: 40px 20px; background-color: ${c.bgColor || '#ffffff'}">\n      <h2 style="text-align: center; margin-bottom: 16px">${c.title || ''}</h2>\n      <div style="max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px">\n        <input type="text" placeholder="Name" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc" />\n        <input type="email" placeholder="Email" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc" />\n        <button style="padding: 10px; background-color: #3b82f6; color: white; border: none; border-radius: 4px">${c.btnText || 'Submit'}</button>\n      </div>\n    </section>`;
     }
     if(node.type === 'features') {
       content += `\n    <section style="padding: 40px 20px; background-color: ${c.bgColor || '#ffffff'}">\n      <h2 style="text-align: center; margin-bottom: 24px">${c.title || ''}</h2>\n      <div style="display: flex; gap: 20px; justify-content: center">\n        <div style="width: 30%; height: 100px; background: #f1f3f5; border-radius: 4px; padding: 16px">Feature Box</div>\n        <div style="width: 30%; height: 100px; background: #f1f3f5; border-radius: 4px; padding: 16px">Feature Box</div>\n      </div>\n    </section>`;
     }
     if(node.type === 'pricing') {
       content += `\n    <section style="padding: 40px 20px; background-color: ${c.bgColor || '#f8f9fa'}">\n      <h2 style="text-align: center; margin-bottom: 24px">${c.title || ''}</h2>\n      <div style="display: flex; gap: 20px; justify-content: center">\n        <div style="width: 250px; height: 300px; background: white; border-radius: 8px; border: 1px solid #eee; padding: 24px">Basic Tier</div>\n        <div style="width: 250px; height: 320px; background: #3b82f6; color: white; border-radius: 8px; margin-top: -10px; padding: 24px">Pro Tier</div>\n      </div>\n    </section>`;
     }
     if(node.type === 'footer') {
       content += `\n    <footer style="padding: 40px 20px; background-color: ${c.bgColor || '#111111'}; color: white">\n      <div style="display: flex; justify-content: space-between">\n        <div>${c.brandName || 'Brand Logo'}</div>\n        <div style="display: flex; gap: 16px"><span>Home</span><span>Terms</span></div>\n      </div>\n    </footer>`;
     }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Site</title>
  <style>
    body { margin: 0; font-family: -apple-system, system-ui, sans-serif; background-color: ${bodyBg}; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>${content}
</body>
</html>`;
};

export default function PublishModal({ isOpen, onClose, pagesData, pages }) {
  const [exportType, setExportType] = useState('zip'); // 'zip' or 'github'
  const [githubToken, setGithubToken] = useState('');
  const [githubRepo, setGithubRepo] = useState('buildflow-my-site');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedStr, setPublishedStr] = useState('');

  if (!isOpen) return null;

  const handlePublish = async () => {
    if (exportType === 'zip') {
      setIsPublishing(true);
      const zip = new JSZip();
      
      pages.forEach(page => {
        const nodes = pagesData[page.id] || [];
        const html = exportToHtml(nodes);
        const filename = page.isHome ? 'index.html' : `${page.name.toLowerCase().replace(/\\s+/g, '-')}.html`;
        zip.file(filename, html);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'website-export.zip');
      
      setIsPublishing(false);
      setPublishedStr('zip-downloaded');
    } else {
      if (!githubToken) return alert('GitHub Token required to publish directly to Github!');
      setIsPublishing(true);
      try {
        const octokit = new Octokit({ auth: githubToken });
        const { data: user } = await octokit.rest.users.getAuthenticated();
        
        await octokit.rest.repos.createForAuthenticatedUser({
          name: githubRepo,
          auto_init: true,
          private: false
        });

        // Add 1s buffer for repo init processing
        await new Promise(r => setTimeout(r, 1000));

        for (const page of pages) {
          const nodes = pagesData[page.id] || [];
          const content = exportToHtml(nodes);
          const filename = page.isHome ? 'index.html' : `${page.name.toLowerCase().replace(/\\s+/g, '-')}.html`;
          
          await octokit.rest.repos.createOrUpdateFileContents({
            owner: user.login,
            repo: githubRepo,
            path: filename,
            message: `Generated automated build step`,
            content: btoa(unescape(encodeURIComponent(content))),
          });
        }

        // Automatically Enable GitHub Pages
        try {
          // We wait 2 seconds because GitHub takes a moment to process the new commits
          await new Promise(r => setTimeout(r, 2000));
          await octokit.rest.repos.createPagesSite({
            owner: user.login,
            repo: githubRepo,
            source: {
              branch: 'main', 
              path: '/'
            }
          });
          setPublishedStr(`${user.login}.github.io/${githubRepo}`);
        } catch (pagesErr) {
          console.warn('Could not auto-enable GitHub pages.', pagesErr);
          setPublishedStr(`github.com/${user.login}/${githubRepo}`);
        }
      } catch(e) {
        alert(`GitHub error: ${e.message}`);
      }
      setIsPublishing(false);
    }
  };

  const resetAndClose = () => {
    setPublishedStr('');
    setIsPublishing(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={resetAndClose}><X size={20} /></button>
        
        <div className="modal-header" style={{paddingBottom: '16px'}}>
          <div className="ai-icon-wrapper" style={{background: 'rgba(59, 130, 246, 0.1)'}}>
             <Globe size={24} style={{color: 'var(--blue-primary)'}} />
          </div>
          <h2>Export & Publish</h2>
          <p>Download your raw HTML/CSS source code or publish automatically to GitHub.</p>
        </div>

        <div className="modal-body">
          {publishedStr === 'zip-downloaded' ? (
            <div style={{textAlign: 'center', padding: '20px 0'}}>
              <div style={{width: 64, height: 64, borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'}}>
                <Check size={32} />
              </div>
              <h3 style={{margin: '0 0 8px'}}>ZIP Downloaded Successfully!</h3>
              <p style={{color: 'var(--text-secondary)'}}>You can extract the folder and double-click index.html to view your site locally.</p>
            </div>
          ) : publishedStr ? (
            <div style={{textAlign: 'center', padding: '20px 0'}}>
              <div style={{width: 64, height: 64, borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'}}>
                <Check size={32} />
              </div>
              <h3 style={{margin: '0 0 8px'}}>Pushed to GitHub!</h3>
              <p style={{color: 'var(--text-secondary)', marginBottom: '24px'}}>Your repository has been initialized with the HTML source.</p>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', margin: '0 24px'}}>
                <a href={`https://${publishedStr}`} target="_blank" rel="noreferrer" style={{color: 'var(--blue-primary)', fontWeight: 500, flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  {publishedStr} <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ) : (
            <>
              <div style={{display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)'}}>
                <button 
                  style={{flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: 'none', background: exportType === 'zip' ? 'var(--bg-primary)' : 'transparent', color: exportType === 'zip' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 500, boxShadow: exportType === 'zip' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                  onClick={() => setExportType('zip')}
                >
                  <Download size={16} /> Export ZIP
                </button>
                <button 
                  style={{flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: 'none', background: exportType === 'github' ? 'var(--bg-primary)' : 'transparent', color: exportType === 'github' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 500, boxShadow: exportType === 'github' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                  onClick={() => setExportType('github')}
                >
                  <GitPullRequest size={16} /> Publish to GitHub
                </button>
              </div>

              {exportType === 'zip' ? (
                <div style={{color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, padding: '0 12px'}}>
                  Downloading this zip file provides you with completely raw, unminified `index.html` and additional subpage files generated directly from your canvas layout. You can self-host these anywhere!
                </div>
              ) : (
                <>
                  <div className="form-group" style={{marginBottom: '16px'}}>
                    <label>Github Repository Name</label>
                    <input 
                      type="text" 
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                      style={{padding: '12px', width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                    />
                  </div>
                  <div className="form-group" style={{marginBottom: 0}}>
                    <label>Personal Access Token</label>
                    <input 
                      type="password" 
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxx"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      style={{padding: '12px', width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                    />
                    <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '8px 0 0'}}>
                      Requires the `repo` scope. Your token is never stored.
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {!publishedStr && (
          <div className="modal-footer">
            <button className="btn-secondary" onClick={resetAndClose} style={{padding: '10px 16px', borderRadius: 'var(--radius-md)', fontWeight: 500, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer'}}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handlePublish} disabled={isPublishing} style={{background: 'var(--blue-primary)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 'var(--radius-md)', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
              {isPublishing ? 'Processing...' : exportType === 'zip' ? 'Download Files' : 'Create Repo & Commit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
