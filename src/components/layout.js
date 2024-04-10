import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { Head, Loader, Nav, Social, Email, Footer } from '@components';
import { GlobalStyle, theme } from '@styles';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Layout = ({ children, location }) => {
  const isHome = location.pathname === '/';
  const [isLoading, setIsLoading] = useState(isHome);
  const [bgColor, setBgColor] = useState('var(--gray)');
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const boxRef = useRef(null);

  const onMouseMoveHandler = e => {
    const originalColor = 'var(--gray)';
    const lightColor = 'var(--green-tint)';
    const gradientSize = 600;

    setLeft(boxRef.current?.offsetLeft ?? 0);
    const x = e.pageX - left;

    setTop(boxRef.current?.offsetTop ?? 0);
    const y = e.pageY - top;

    const xy = `${x} ${y}`;

    setBgColor(
      `-webkit-gradient(radial, ${xy}, 0, ${xy}, ${gradientSize}, from(${lightColor}), to(rgba(255,255,255,0.0))), ${originalColor}`,
    );
  };

  const onMouseLeaveHandler = () => {
    setBgColor('var(--gray)');
  };

  // Sets target="_blank" rel="noopener noreferrer" on external links
  const handleExternalLinks = () => {
    const allLinks = Array.from(document.querySelectorAll('a'));
    if (allLinks.length > 0) {
      allLinks.forEach(link => {
        if (link.host !== window.location.host) {
          link.setAttribute('rel', 'noopener noreferrer');
          link.setAttribute('target', '_blank');
        }
      });
    }
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (location.hash) {
      const id = location.hash.substring(1); // location.hash without the '#'
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }

    handleExternalLinks();
  }, [isLoading]);

  return (
    <>
      <Head />

      <div id="root">
        <ThemeProvider theme={theme}>
          <GlobalStyle />

          <a className="skip-to-content" href="#content">
            Skip to Content
          </a>

          {isLoading && isHome ? (
            <Loader finishLoading={() => setIsLoading(false)} />
          ) : (
            <StyledContent
              style={{ background: bgColor }}
              ref={boxRef}
              onMouseMove={e => onMouseMoveHandler(e)}
              onMouseLeave={onMouseLeaveHandler}>
              <Nav isHome={isHome} />
              <Social isHome={isHome} />
              <Email isHome={isHome} />

              <div id="content">
                {children}
                <Footer />
              </div>
            </StyledContent>
          )}
        </ThemeProvider>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Layout;
