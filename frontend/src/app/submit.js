export default async function handler(req, res) {
    if (req.method === 'POST') {
        const backendRes = await fetch('http://localhost:5000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        const data = await backendRes.json();
        res.status(200).json(data);
    }
}