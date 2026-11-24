import { FileText, Github, Linkedin, Mail } from "lucide-react";
import { PROFILE } from "../data/profile";

export function SiteFooter() {
  const linkedinUrl = PROFILE.linkedinUrl.trim();
  const resumeUrl = PROFILE.resumeUrl.trim();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-identity">
            <span className="footer-name">{PROFILE.name}</span>
            <span className="footer-affiliation">{PROFILE.affiliation}</span>
          </div>

          <nav aria-label="Contact and profiles">
            <ul className="footer-links">
              <li>
                <a
                  className="footer-link"
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} aria-hidden="true" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a className="footer-link" href={`mailto:${PROFILE.email}`}>
                  <Mail size={16} aria-hidden="true" />
                  <span>{PROFILE.email}</span>
                </a>
              </li>
              {linkedinUrl ? (
                <li>
                  <a
                    className="footer-link"
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin size={16} aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                </li>
              ) : null}
              {resumeUrl ? (
                <li>
                  <a
                    className="footer-link"
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={16} aria-hidden="true" />
                    <span>Resume</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>

        <p className="footer-note">
          Static public portfolio — zero analytics trackers, cookies, or third-party data
          collection. Theme preference is stored only in your browser when toggled.
        </p>
      </div>
    </footer>
  );
}
