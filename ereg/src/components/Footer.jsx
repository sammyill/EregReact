import facebook from "../assets/facebook.svg"
import instagram from "../assets/instagram.svg"
import itssmart from "../assets/itssmart.svg"
import { NavLink } from "react-router-dom";

export default function ModuleCard({moduleTitle,moduleProfessor,moduleDescription}){


    return (
 <footer className="bg-gray-800 text-gray-200 px-4 py-10">
  <div className="max-w-6xl mx-auto grid gap-8 text-sm text-center md:text-left md:grid-cols-3">
    
    <div className="flex flex-col items-center md:items-start">
      <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
      <div className="flex space-x-4">
        <a href="https://www.facebook.com/itsmadeinitaly" target="_blank" aria-label="Facebook">
          <img src={facebook} alt="Facebook" className="w-6 h-6" />
        </a>
        <a href="https://www.instagram.com/itsmadeinitaly/#" target="_blank" aria-label="Instagram">
          <img src={instagram} alt="Instagram" className="w-6 h-6" />
        </a>
        <a href="https://www.itssmart.it/" target="_blank" aria-label="School Website">
          <img src={itssmart} alt="School Website" className="w-6 h-6" />
        </a>
      </div>
    </div>

    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">Useful Links</h3>
      <ul className="space-y-1">
        <li><NavLink to="/faq" className="hover:underline">FAQ</NavLink></li>
        <li><NavLink to="/terms" className="hover:underline">Terms of Service</NavLink></li>
        <li><NavLink to="/privacy" className="hover:underline">Privacy Policy</NavLink></li>
      </ul>
    </div>

    <div className="flex flex-col items-center md:items-end">
      <h2 className="text-xl font-semibold mb-2">Er3g</h2>
      <p>© 2025 Ereg. All rights reserved.</p>
      <p>
        Email:
        <a href="mailto: info@itssmart.it" className="text-blue-400 hover:underline">
           info@itssmart.it
        </a>
      </p>
    </div>
    
  </div>
</footer>
    )
}