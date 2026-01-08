export async function getParams() {
  const res = await fetch('/params/read');
  if (!res.ok) throw new Error('Failed to read params');
  return res.json();
}

export async function setParam(id, value) {
  const res = await fetch('/params/write', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, value }),
  });
  if (!res.ok) throw new Error('Failed to write param');
}
