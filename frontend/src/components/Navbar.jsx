import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscChromeClose } from "react-icons/vsc";
export default function Navbar() {
  const [navbarState, setNavbarState] = useState(false);
  return (
    <>
      <Nav>
        <div className="brand">
          <div className="container">
            <img src={logo} alt="" />
            GOEXPLORE
          </div>
          <div className="toggle">
            {navbarState ? (
              <VscChromeClose onClick={() => setNavbarState(false)} />
            ) : (
              <GiHamburgerMenu onClick={() => setNavbarState(true)} />
            )}
          </div>
        </div>

        <ul>
          {/* <li>
            <a href="#home">Home</a>
          </li> */}
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#tour">Packages</a>
          </li>
          <li>
            <a href="#spk">Recommendation</a>
          </li>
          <li>
            <a href="#testimonials">Testimonials</a>
          </li>
        </ul>

      </Nav>
      <ResponsiveNav state={navbarState}>
        <ul>
          {/* <li>
            <a href="#home" onClick={() => setNavbarState(false)}>
              Home
            </a>
          </li> */}
          <li>
            <a href="#home" onClick={() => setNavbarState(false)}>
              Home
            </a>
          </li>
          <li>
            <a href="#tour" onClick={() => setNavbarState(false)}>
              Packages
            </a>
          </li>
          <li>
            <a href="#spk" onClick={() => setNavbarState(false)}>
              Recommendation
            </a>
          </li>
          <li>
            <a href="#testimonials" onClick={() => setNavbarState(false)}>
              Testimonials
            </a>
          </li>
        </ul>
      </ResponsiveNav>
    </>
  );
}

const Nav = styled.nav`
  position: fixed; /* Navbar tetap di atas */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10; /* Pastikan navbar ada di atas elemen lain */
  background-color: white; /* Warna latar navbar */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Tambahkan bayangan untuk efek */
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .brand {
    .container {
      // cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.4rem;
      font-size: 1.2rem;
      font-weight: 900;
      text-transform: uppercase;
    }
    .toggle {
      display: none;
    }
  }

  ul {
    display: flex;
    gap: 1rem;
    list-style-type: none;
    li {
      a {
        text-decoration: none;
        color: #0077b6;
        font-size: 1.2rem;
        transition: 0.1s ease-in-out;
        &:hover {
          color: #023e8a;
        }
      }
      &:first-of-type {
        a {
          color: #023e8a;
          font-weight: 900;
        }
      }
    }
  }

  @media screen and (min-width: 280px) and (max-width: 1080px) {
    .brand {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .toggle {
        display: block;
      }
    }
    ul {
      display: none;
    }
  }
`;

const ResponsiveNav = styled.div`
  display: flex;
  position: fixed;
  z-index: 9;
  top: ${({ state }) => (state ? "50px" : "-400px")};
  background-color: white;
  height: 30vh;
  width: 100%;
  align-items: center;
  transition: 0.3s ease-in-out;

  ul {
    list-style-type: none;
    width: 100%;
    li {
      width: 100%;
      margin: 1rem 0;
      margin-left: 2rem;

      a {
        text-decoration: none;
        color: #0077b6;
        font-size: 1.2rem;
        transition: 0.1s ease-in-out;
        &:hover {
          color: #023e8a;
        }
      }
      &:first-of-type {
        a {
          color: #023e8a;
          font-weight: 900;
        }
      }
    }
  }
`;
