let blacklisted_words = ["<script", "<link", "javascript", "javascript:", "html", ".css", "xss"];

module.exports = {
    keysChecker: async(req, res, next) => {
        try{
            for(let key of Object.keys(req.body)) {
                if(typeof(req.body[key]) === "string") {
                    let trimmed_val = req.body[key].split(" ").join("");

                    let result = blacklisted_words.filter(word => {
                        return trimmed_val.toLowerCase().includes(word);
                    });

                    if(result.length) {
                        // console.log("req: ", key, req.body[key]);
                        return res.status(402).json({
                            message: 'Invalid parameters',
                            status: false
                        });
                    }
                }
            }        
        }catch(e){
            console.log("badPayloadChecker::Error:", e.message);
            return res.status(402).json({
                message: 'Invalid request',
                status: false
            });
        }

        next();
    }
}