export default async function getTodos() {
  const BASE_URL = "https://jsonplaceholder.typicode.com/"
  const res = await fetch(`${BASE_URL}/todos`);
  return res.json();
}