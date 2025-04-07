export async function GET() {
  return new Response('Method not allowed', { status: 405 });
}

interface ResetPasswordEmailParams {
  resetLink: string;
  supportEmail: string;
  appName: string;
}

const getResetPasswordEmailTemplate = (
  params: ResetPasswordEmailParams
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Jelszó visszaállítási kérelem</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50 font-sans">
      <div class="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg my-8">
        <div class="text-3xl font-bold text-blue-600 mb-6">Jelszó visszaállítási kérelem</div>
        
        <div class="text-gray-700 text-lg mb-6">
          <p>Jelszó visszaállítási kérelmet kaptunk a(z) ${params.appName} fiókodhoz. Kattints az alábbi gombra a folytatáshoz:</p>
        </div>
        
        <div class="text-center my-8">
          <a href="${params.resetLink}" 
             class="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md">
            Jelszó visszaállítása
          </a>
        </div>
        
        <div class="text-gray-700 mb-8">
          <p>Ha nem te kérted a jelszó visszaállítását, kérjük, hagyd figyelmen kívül ezt az e-mailt, vagy vedd fel a kapcsolatot az ügyfélszolgálattal, ha kérdésed van.</p>
        </div>
        
        <div class="border-t border-gray-200 pt-6 mt-8 text-sm text-gray-600">
          <p class="mb-4">Ez a link 1 óra múlva lejár.</p>
          <p class="mb-2">Ha problémád van a fenti gombbal, másold be ezt a linket a böngésződbe:</p>
          <p class="break-all text-blue-600 mb-4">${params.resetLink}</p>
          <p class="text-gray-700">
            Segítségre van szükséged? Írj az ügyfélszolgálatunknak: 
            <a href="mailto:${params.supportEmail}" class="text-blue-600 hover:text-blue-800">${params.supportEmail}</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}