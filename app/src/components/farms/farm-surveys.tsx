import { Card, CardContent } from "@/components/ui/card.tsx";
import type { Farm } from "@/types/farm";
import { PrintKeyValue } from "@/components/print-key-value.tsx";
import { Separator } from "@/components/ui/separator.tsx";

const annualSurvey = {
  survey: {
    title: "Yearly annual surveys",
    description: "",
    surveyQuestions: [
      { question: "Tbd", id: 1 },
      { question: "Tbd", id: 1 },
      { question: "Tbd", id: 1 },
      { question: "...", id: 1 },
    ],
  },
  surveyAnswers: [],
};

const eudrSurvey = {
  survey: {
    title: "Deforestation questionnaire for EUDR",
    description: "Based on the legal framework by ACM",
    surveyQuestions: [
      { question: "Respondent owns plot?", id: 1 },
      { question: "Respondent leases plot?", id: 1 },
      { question: "Respondent has right to farm the plot?", id: 1 },
      { question: "Has land title document?", id: 1 },
      { question: "Owner Name", id: 1 },
      { question: "Is plot established before 31 December 2020?", id: 1 },
      { question: "Has shade trees?", id: 1 },
      {
        question:
          "Do you know the distance to the large/permanent forest/reserve area?",
        id: 1,
      },
      {
        question:
          "How far is the plot from athelarge/permanent forest/reserve area (km)?",
        id: 1,
      },
      {
        question:
          "Has the farmer cut down any forests to plant cocoa or other crops?",
        id: 1,
      },
      {
        question:
          " Is the farmer polluting any natural water sources in anyway?",
        id: 1,
      },
      {
        question: "Has the farmer cut down any forests to plant crops?",
        id: 1,
      },
    ],
  },
  surveyAnswers: [],
};

export function FarmSurveys({ farm }: { farm: Farm }): JSX.Element {
  let surveyResults = farm?.surveyResults;
  if (!surveyResults || surveyResults.length === 0) {
    surveyResults = [];
    // surveyResults.push(annualSurvey);
    surveyResults.push(eudrSurvey);
  }

  return (
    <>
      {/*Overlflow-hidden hides the "C mapbox text"*/}
      {surveyResults.length === 0 && (
        <Card className="my-4 overflow-hidden">
          <CardContent className="p-6">No surveys added yet</CardContent>
        </Card>
      )}
      {surveyResults.map((surveyResult) => {
        return (
          <Card className="my-4 overflow-hidden">
            <CardContent className="p-6">
              <div className="grid gap-3">
                <div className="font-semibold">{surveyResult.survey.title}</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  {surveyResult.survey.description}
                </div>
                <Separator className="my-2" />
                {surveyResult.survey.surveyQuestions.map((question) => {
                  const answer = surveyResult.surveyAnswers.find(
                    (answer) => answer.survey_question_id === question.id
                  );
                  return (
                    <ul className="grid gap-3">
                      <PrintKeyValue
                        label={question.question}
                        value={answer?.answer || "(no answer yet)"}
                      />
                    </ul>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
