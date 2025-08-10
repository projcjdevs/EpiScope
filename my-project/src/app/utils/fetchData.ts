export async function fetchOutBreaks() {
  const res = await fetch('http://localhost:8000/outbreaks', {
    headers: {
      'x-api-key': 'clean-data-api'
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}