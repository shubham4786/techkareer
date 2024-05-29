export async function getData(url: string) {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

    try {
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            },
        };

        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${url}`, requestOptions);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const posts = await response.json();

        return posts.records;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
