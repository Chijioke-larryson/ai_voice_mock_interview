import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import {getRandomInterviewCover} from "@/lib/utils";
import {db} from "@/firebase/admin";



export async function GET() {
    return Response.json(
        { success: true, data: "Thank You!" },
        { status: 200 }
    );


}

export async function POST(request: Request){
    const {type, role, level, techstack, amount, userid, questions } = await  request.json();

    try {
        const { text } = await generateText({
            messages: undefined,
            model: google('gemini-2.0-flash-001'),
            prompt: 'Prepare questions for a job interview.' +
                `The job is ${role}.
                 The job experience level is ${level}.
                 The tech stack used in the job is ${techstack}.
                 The focus between behavioral and technical questions should be lean toward:${type}
                 The amount of questions required is ${amount}.
                 Please return only questions , without any additional text.
                 The questions are going to read by a voice assistance so do not use "/" or "8" or an
                 Return the question like this:
                   ["Question 1", "Question 2", "Question 3"]
                    Thank you! <3
    \`;`




        });
        const interview ={
            role, type, level,
            techstack: techstack.split(' , '),
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()

        }
        await db.collection("interviews").add(interview);

        return Response.json({success: true},
            {status:200})

    }catch (error) {
        console.error(error)

        return Response.json({ success: false, error}, { status: 500});
    }
}
