import React from "react";
import { Link, redirect } from "react-router-dom";

const Navbar: React.FC<{}> = () => {
  return (
    <header>
      <div >
        <div >
          <div>
            <h4>Routing Example v6</h4>
          </div>
          <ul >
            <li>
              <Link to="/" >Home</Link>
            </li>
            <li>
              <Link to="/people" >People</Link>
            </li>
          </ul>
          <div>
            <Link to="/login" type="button">Login</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;