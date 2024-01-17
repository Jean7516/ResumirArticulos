
import { logo } from "../assets";

const Hero = () => {
  return (
    
    <header className='w-full flex justify-center items-center flex-col'>
      
      <nav className='flex justify-between items-center w-full mb-5 pt-3'>
        <img src={logo} alt='sumz_logo' className='w-44 object-contain' />
        
      </nav>

      <h1 className='head_text'>
      Resumir cualquier artículo <br className='max-md:hidden' />
        <span className='orange_gradient '> con OpenAI</span>
      </h1>
      <h2 className='desc'>
        Simplifique su lectura, un resumidor de artículos de código abierto
         que transforma artículos extensos en resúmenes claros y concisos
      </h2>
    </header>
  );
};

export default Hero;