import React from 'react';
import PropTypes from 'prop-types';

const HamburgerMenu = ({ menuOpen, setMenuOpen, setView }) => {
  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="menu-button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d={
              menuOpen
                ? "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                : "M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1.5 7C1.22386 7 1 7.22386 1 7.5C1 7.77614 1.22386 8 1.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H1.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
            }
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>

      {menuOpen && (
        <div className="menu-panel">
          <a
            href="https://sql-learning-journey-tracker.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            SQL Topics
          </a>
          <a
            href="http://devhints.io/mysql"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 9H15M9 12H15M9 15H12M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Check Syntax
          </a>
          <a
            href="https://github.com/BryanLomerio"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5229 6.47715 22 12 22C17.5229 22 22 17.5229 22 12C22 6.47715 17.5229 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.3333 19V17.137C14.3583 16.8275 14.3154 16.5163 14.2073 16.2242C14.0993 15.9321 13.9286 15.6657 13.7067 15.4428C15.8 15.2156 18 14.4431 18 10.8989C17.9998 9.99256 17.6418 9.12101 17 8.46461C17.3039 7.67171 17.2824 6.79207 16.94 6.01461C16.94 6.01461 16.1533 5.7874 14.3333 6.97174C12.8053 6.57303 11.1947 6.57303 9.66666 6.97174C7.84666 5.7874 7.05999 6.01461 7.05999 6.01461C6.71757 6.79207 6.69609 7.67171 6.99999 8.46461C6.35341 9.12588 5.99501 10.0053 5.99999 10.9178C5.99999 14.4337 8.19999 15.2062 10.2933 15.4618C10.074 15.6829 9.90483 15.9461 9.79686 16.2347C9.68889 16.5232 9.64453 16.8306 9.66666 17.137V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.66667 17.7018C7.66667 18.3335 6 17.7018 5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            GitHub
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setView("problems");
              setMenuOpen(false);
            }}
            className="menu-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5 14.25V11.625C19.5 9.76104 18.7598 7.97366 17.4393 6.65314C16.1187 5.33261 14.3314 4.59235 12.4675 4.59235C10.6036 4.59235 8.81631 5.33261 7.49579 6.65314C6.17526 7.97366 5.435 9.76104 5.435 11.625V14.25M5.435 14.25C4.97921 14.25 4.54174 14.4344 4.21729 14.7588C3.89284 15.0833 3.7085 15.5208 3.7085 15.9765C3.7085 16.4323 3.89284 16.8698 4.21729 17.1942C4.54174 17.5187 4.97921 17.703 5.435 17.703H19.5C19.9558 17.703 20.3933 17.5187 20.7177 17.1942C21.0422 16.8698 21.2265 16.4323 21.2265 15.9765C21.2265 15.5208 21.0422 15.0833 20.7177 14.7588C20.3933 14.4344 19.9558 14.25 19.5 14.25M16.875 14.25H8.06C7.8385 14.25 7.62614 14.1578 7.46861 14.0003C7.31107 13.8427 7.2188 13.6304 7.2188 13.4089V12.4635C7.2188 12.2421 7.31107 12.0297 7.46861 11.8722C7.62614 11.7146 7.8385 11.6224 8.06 11.6224H16.875C17.0965 11.6224 17.3089 11.7146 17.4664 11.8722C17.6239 12.0297 17.7162 12.2421 17.7162 12.4635V13.4089C17.7162 13.6304 17.6239 13.8427 17.4664 14.0003C17.3089 14.1578 17.0965 14.25 16.875 14.25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Practice Problems
          </a>
        </div>
      )}
    </div>
  );
};

HamburgerMenu.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
};

export default HamburgerMenu;
