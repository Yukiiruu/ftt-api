export default async function handler(req, res) {
  // CORS — autoriser ton site GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { endpoint } = req.query;
  if (!endpoint) { res.status(400).json({ error: 'endpoint manquant' }); return; }

  const RIOT_KEY = process.env.RIOT_API_KEY;
  if (!RIOT_KEY) { res.status(500).json({ error: 'Clé API Riot non configurée' }); return; }

  try {
    const url = decodeURIComponent(endpoint);
    // Sécurité : on n'autorise que les domaines Riot officiels
    if (!url.startsWith('https://euw1.api.riotgames.com') && 
        !url.startsWith('https://europe.api.riotgames.com') &&
        !url.startsWith('https://ddragon.leagueoflegends.com')) {
      res.status(403).json({ error: 'Domaine non autorisé' }); return;
    }

    const response = await fetch(url, {
      headers: { 'X-Riot-Token': RIOT_KEY }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
