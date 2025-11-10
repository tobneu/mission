export interface Question {
    id: number;
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    // human-readable hint where the next QR is located
    nextTaskLocation?: string;
    // secret key that unlocks the next task (can be copied to clipboard but should not be shown directly)
    nextTaskCode?: string;
    finalRevealText?: string;
    timeLock?: string; // ISO string
}
export const questions: Question[] = [
    {
        id: 1,
        questionText: "Der Entwickler-Arbeitsplatz ist heilig. Wie viele **externe Monitore** (Laptop-Bildschirm zählt nicht) stehen auf dem Schreibtisch des Gastgebers?",
        options: ["1", "2", "3", "4"],
        correctAnswerIndex: 1,
        nextTaskLocation: "Rückseite Monitor",
        nextTaskCode: "MONITORX"
    },
    {
        id: 2,
        questionText: "Nach anhaltender Kritik kündigte ein namhafter Spitzenfunktionär seinen Rücktritt von einer wichtigen Position in der Oesterreichischen **Nationalbank** an. Wie lautet sein Nachname?",
        options: ["Kogler", "Mahrer", "Sobotka", "Nehammer"],
        correctAnswerIndex: 1,
        nextTaskLocation: "In der Geldbörse des Gastgebers",
        nextTaskCode: "NATIBA" 
    },
    {
        id: 3,
        questionText: "Zähle alle Bilder und Fotos an der Wand im Eingangsbereich. Wie viele sind es insgesamt?",
        options: ["4", "5", "9", "10"],
        correctAnswerIndex: 1,
        nextTaskLocation: "Fußmatte im Badezimmer",
        nextTaskCode: "FLURBILDA"
    },
    {
        id: 4,
        questionText: "Löse die Gleichung auf dem Whiteboard. Was ist der Wert von x?",
        options: ["3", "5", "15", "10"],
        correctAnswerIndex: 1,
        timeLock: "2025-11-10T15:35:00+01:00",
        nextTaskLocation: "Ofen",
        nextTaskCode: "REGALMOMENT"
    },
    {
        id: 5, // Finale Frage
        questionText: "Löse folgendes Gleichungssystem nach x und y. Der Code für die Schatzkiste ist die **Summe** beider Lösungen (x+y): $3x + y = 79$ und $x - y = -31$.",
        options: ["42", "55", "79", "104"], // HIER DIE ANTWORTEN ANPASSEN!
        correctAnswerIndex: 1, // 55 ist die 2. Option (Index 1)
        finalRevealText: "Der Schatz ist im Garten hinter dem Baum" // HIER DEN FINALEN HINWEIS ANPASSEN!
    }
];

export const getQuestionById = (id: number): Question | undefined => {
    return questions.find(q => q.id === id);
};

export const getTotalTasks = (): number => {
    return questions.length;
};