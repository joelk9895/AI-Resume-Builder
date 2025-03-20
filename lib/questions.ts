import predefinedQuestions from '@/data/predefined-questions.json';

export interface ResumeQuestion {
  id: string;
  text: string;
  type: string;
}

export function getQuestions(): ResumeQuestion[] {
  return predefinedQuestions;
}

export function getQuestionById(id: string): ResumeQuestion | undefined {
  return predefinedQuestions.find(q => q.id === id);
}

export function getNextQuestion(currentId: string): ResumeQuestion | undefined {
  const currentIndex = predefinedQuestions.findIndex(q => q.id === currentId);
  if (currentIndex === -1 || currentIndex === predefinedQuestions.length - 1) {
    return undefined;
  }
  return predefinedQuestions[currentIndex + 1];
}

export function getPreviousQuestion(currentId: string): ResumeQuestion | undefined {
  const currentIndex = predefinedQuestions.findIndex(q => q.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return predefinedQuestions[currentIndex - 1];
}
