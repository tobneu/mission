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
        questionText: "Der Entwickler-Arbeitsplatz ist heilig. Wie viele **externe Monitore** stehen auf dem Schreibtisch des Gastgebers?",
        options: ["1", "2", "3", "4"],
        correctAnswerIndex: 1,
        nextTaskLocation: "Rückseite Monitor",
        nextTaskCode: "MONITORX"
    },
    {
        id: 2,
        questionText: "Nach anhaltender Kritik ist ein namhafter Spitzenfunktionär von der österreischischen Nationalbank und Wirtschaftskammer zurückgetreten. Wann wurde die Person geboren?",
        options: ["Mi, 27. März 1973", "27/03/1973", "1973-03-27", "03.27.1973"],
        correctAnswerIndex: 2,
        nextTaskLocation: "Nationalbank (Geldbörse des Gastgebers)",
        nextTaskCode: "GELDSCHEIN"
    },
    {
        id: 3,
        questionText: "Zähle alle Bilder und Fotos an der Wand im Eingangsbereich. Wie viele sind es insgesamt?",
        options: ["2", "3", "5", "8"],
        correctAnswerIndex: 2,
        nextTaskLocation: "Rechte Seite der Kommode",
        nextTaskCode: "WANDERSCHUNG"
    },
    {
        id: 4,
        questionText: "Offenbar kannst du noch bis 5 zählen. Geh raus und füll bitte nach. Zähl nebenbei: Wie viele Lichter hat die **Lichterkette** draußen am Schirm?",
        options: ["ca. 100", "ca. 110", "ca. 120", "ca. 130"],
        correctAnswerIndex: 2,
        //timeLock: "2025-11-10T15:35:00+01:00",
        nextTaskLocation: "Ofen",
        nextTaskCode: "Ofen"
    },
    {
        id: 5, // Finale Frage
        questionText: "Du befindest dich in Oberalm im Jahr 1951. Was ist die Hälfte der Einwohnerzahl laut Volkszählung?", 
        options: ["787", "1234", "1694", "847"], // HIER DIE ANTWORTEN ANPASSEN!
        correctAnswerIndex: 0, // 787 ist die 1. Option (Index 0)
        timeLock: "2025-11-15T21:00:00+01:00",
        nextTaskLocation: "Oberalm den Oberalmern!",
        nextTaskCode: "OBERALM1951",
    },
    {
        id: 6,
        questionText: "Finde die übernächste Primzahl nach 100. Wie lautet sie?",
        options: ["101", "103", "107", "109"],
        correctAnswerIndex: 1,
        //timeLock: "2025-11-15T20:00:00+01:00",
        nextTaskLocation: "Unter dem Teppich im Wohnzimmer",
        nextTaskCode: "PRIMZAHL"
    },
    {
        id: 7,
        questionText: "Was ist die Quersumme der Hausnummer des Gebäudes, in dem du dich gerade befindest?",
        options: ["5", "7", "9", "11"],
        correctAnswerIndex: 3,
        nextTaskLocation: "Hinter der Bank auf der Terasse",
        nextTaskCode: "HAUSNUMMER"
    },
    {
        id: 8,
        questionText: "Welche berühmte Persönlichkeit erzählte 1909 in Salzburg zum ersten mal öffentlich von der Relativitätstheorie?",
        options: ["Albert Einstein", "Max Planck", "Niels Bohr", "Erwin Schrödinger"],
        correctAnswerIndex: 0,
        nextTaskLocation: "Hinter der Nintendo Switch im Wohnzimmer",
        nextTaskCode: "RELATIVITAET"
    },
    {
        id: 9,
        questionText: "Låt x vara antalet stjärnor på EU-flaggan och y antalet politiska distrikt i Steiermark. Vad är x * y?",
        options: ["156", "122", "106", "144"],
        correctAnswerIndex: 0,
        timeLock: "2025-11-15T23:30:00+01:00",
        finalRevealText: "Hinter dem Apfelbaum im Garten",
        nextTaskCode: "EUSTAR"
    }
];

export const getQuestionById = (id: number): Question | undefined => {
    return questions.find(q => q.id === id);
};

export const getTotalTasks = (): number => {
    return questions.length;
};