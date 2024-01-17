import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";
import axios from "axios";
const translateApiKey = import.meta.env.VITE_TRANSLAT_API_KEY;
const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  // Consulta diferida RTK
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Cargar datos desde localStorage en el montaje
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      const options = {
        method: "GET",
        url: "https://translate-all-languages.p.rapidapi.com/translate",
        params: {
          toLang: "es",
          text: newArticle.summary,
          fromLang: "en",
        },
        headers: {
          "X-RapidAPI-Key":
            translateApiKey,
          "X-RapidAPI-Host": "translate-all-languages.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        newArticle.summary = JSON.stringify(response.data.translatedText);
        setArticle(newArticle);
        setAllArticles(updatedAllArticles);

        localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Copie la URL y active el ícono para recibir comentarios de los usuarios.
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  return (<>
    <section className="mt-16 w-full max-w-3xl ">
      {/* Buscar */}
      <div className="flex flex-col w-full gap-2  ">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link-icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />

          <input
            type="url"
            placeholder="Paste the article link"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className="url_input peer" 
            // Cuando necesite diseñar un elemento según el estado de un elemento hermano, marque el hermano con la clase de pares y use modificadores peer-* para diseñar el elemento de destino.
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 "
          >
            <p>↵</p>
          </button>
        </form>

        {/* Historial del Navegador */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      </section>
      <section className="max-w-5xl">
      {/* Mostrar Resultados */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-2 col">
              <h2 className="font-satoshi font-bold text-gray-100 text-2xl">
                 <span className="blue_gradient">Resumen</span> del articulo:
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-lg text-slate-50">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>


</>
  );
};

export default Demo;
