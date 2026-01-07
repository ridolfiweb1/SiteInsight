
import { TechnicalInfo } from '../types';

export const getTechnicalInfo = async (url: string): Promise<TechnicalInfo> => {
  try {
    const hostname = new URL(url).hostname;
    
    // 1. Resolve IP using Google DNS-over-HTTPS (reliable and CORS-friendly)
    const dnsResponse = await fetch(`https://dns.google/resolve?name=${hostname}&type=A`);
    if (!dnsResponse.ok) throw new Error('Falha na resolução de DNS');
    
    const dnsData = await dnsResponse.json();
    const ip = dnsData.Answer?.[0]?.data || 'Não encontrado';

    // 2. Get Geolocation and Provider info
    let country = 'Desconhecido';
    let provider = 'Desconhecido';
    let location = 'Desconhecido';

    if (ip !== 'Não encontrado' && !ip.includes(':')) { // Skip IPv6 for this simple lookup
      try {
        // ipwho.is is generally more permissive with CORS for client-side requests
        const geoResponse = await fetch(`https://ipwho.is/${ip}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.success) {
            country = geoData.country || 'Desconhecido';
            provider = geoData.connection?.isp || geoData.connection?.org || 'Desconhecido';
            location = `${geoData.city || ''}, ${geoData.region || ''}`;
          }
        }
      } catch (e) {
        // Silently fail geolocation to not break the whole analysis if one service is down/blocked
        console.warn('Erro ao buscar geolocalização via ipwho.is:', e);
      }
    }

    const protocol = url.startsWith('https') ? 'HTTPS' : 'HTTP';
    
    return {
      ip,
      country,
      provider,
      status: dnsData.Status === 0 ? 'online' : 'offline',
      protocol: protocol as 'HTTP' | 'HTTPS',
      location
    };
  } catch (error) {
    console.error('Erro técnico detalhado:', error);
    throw new Error('Não foi possível obter informações técnicas do domínio. Verifique se a URL está correta.');
  }
};
