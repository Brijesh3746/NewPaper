import React, { useState } from "react";

function App() {
  const [baseUrl, setBaseUrl] = useState("");
  const [page4Url, setPage4Url] = useState("");
  const [totalPages, setTotalPages] = useState(16);
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    if (!baseUrl) {
      alert("Please enter the base URL");
      return;
    }
    if ( !page4Url || !totalPages || totalPages <= 0) {
      alert("Check page4Url also || Please enter a valid number of pages");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, totalPages,page4Url }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "newspaper.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error(error);
      alert("Error generating PDF");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex w-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          📰 Newspaper PDF Downloader
        </h2>

        {/* Base URL Input */}
        <input
          type="text"
          placeholder="Paste Base URL (ending with -)"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Page 4 URL Input */}
        <input
          type="text"
          placeholder="Page 4 url"
          value={page4Url}
          onChange={(e) => setPage4Url(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Total Pages Input */}
        <input
          type="number"
          placeholder="Total Pages"
          value={totalPages}
          onChange={(e) => setTotalPages(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Button */}
        <button
          onClick={generatePDF}
          disabled={loading}
          className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
        >
          {loading ? "Processing..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
}

export default App;


// import React, { useState } from "react";

// function App() {
//   const [baseUrl, setBaseUrl] = useState("");
//   const [page4Url, setPage4Url] = useState("");
//   const [totalPages, setTotalPages] = useState(16);
//   const [loading, setLoading] = useState(false);

//   const generatePDF = async () => {
//     if (!baseUrl) {
//       alert("Please enter the base URL");
//       return;
//     }
   

//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:4000/generate-pdf", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ baseUrl, totalPages }),
//       });

//       if (!response.ok) throw new Error("Failed to generate PDF");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "newspaper.pdf";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     } catch (error) {
//       console.error(error);
//       alert("Error generating PDF");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex w-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
//       <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-md">
//         <h2 className="text-2xl font-bold text-white text-center mb-6">
//           📰 Newspaper PDF Downloader
//         </h2>

//         {/* Base URL Input */}
//         <input
//           type="text"
//           placeholder="Paste Base URL (ending with -)"
//           value={baseUrl}
//           onChange={(e) => setBaseUrl(e.target.value)}
//           className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//         />

        

//         {/* Total Pages Input */}
//         <input
//           type="number"
//           placeholder="Total Pages"
//           value={totalPages}
//           onChange={(e) => setTotalPages(e.target.value)}
//           className="w-full p-3 mb-6 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//         />

//         {/* Button */}
//         <button
//           onClick={generatePDF}
//           disabled={loading}
//           className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
//         >
//           {loading ? "Processing..." : "Download PDF"}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default App;


