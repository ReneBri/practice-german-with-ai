import { useEffect, useState } from "react"


export const useFetchResponse = () => {
    const [fetchIsPending, setFetchIsPending] = useState(null)
    const [fetchError, setFetchError] = useState(null)
    const [isCancelled, setIsCancelled] = useState(false)

    const fetchResponse = async (messages, personaChoice) => {


        try{
            setFetchIsPending(true)
            setFetchError(null)
            const response = await fetch("https://us-central1-practice-german-with-ai.cloudfunctions.net/app/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({
                messages: [personaChoice, ...messages]
                })
            });
            const data = await response.json();
            
            if(!isCancelled){
                setFetchIsPending(false)
                return data.message
            }
        }
        catch (err) {
        setFetchError(err.message)
        setFetchIsPending(false)
        }

        // add clean up function when another page is added
    }


    return { fetchIsPending, fetchError, fetchResponse}
}