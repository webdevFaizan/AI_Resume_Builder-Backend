import ai from "../configs/ai.js";


//controller for enhancing ai professional summary


//POST: /api/ai/enhance-pro-summary
const enhanceProfessionalSummary = async(req, res) => {
    try {
        const userId = req.userId; //This might not be required because we are actually fetching any data from backend where the user authentication would be required.
        const {resumeId, resumeData} = req.body; //Even resumeId is also not required, since we are simply converting a given set of text into an enhanaced version of the text.
        const professional_summary = resumeData.professional_summary;

        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                { role: "system", content: "You are a professional assistant. Be as objective as you can, keep the reponse short and crisp and always summarize the response. The output for this summary " },
                {
                    role: "user",
                    content: professional_summary,
                },
            ],
        });

        console.log(response.choices[0].message);

        if(!response?.choices[0].message){
            return res.status(500).json({message: "Internal server error"});
        }
        return res.status(200).json({response});
    }
    catch(error){
        return res.status(500).json({message: "Error" + error})
    }
}

export {enhanceProfessionalSummary};