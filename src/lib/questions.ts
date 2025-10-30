export interface Question {
    id: number;
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    nextStationCode?: string;
    finalRevealText?: string;
    timeLock?: string; // ISO string
}

export const questions: Question[] = [
    // HINWEIS: Bitte alle 'options' und 'correctAnswerIndex' selbst anpassen!
    {
        id: 1,
        questionText: "Wie viele Weinflaschen stehen *exakt* im Küchenregal (nur die sichtbaren)?",
        options: ["5", "6", "7", "8"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
        nextStationCode: "KUEHLSCHRANK"
    },
    {
        id: 2,
        questionText: "Welche Marke hat der Senf in der Kühlschranktür?",
        options: ["Mautner Markhof", "Kühne", "Thomy", "Bautz'ner"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 3,
        questionText: "Zähle alle Bilder (inkl. Fotos) an der Wand im Flur. Wie viele sind es?",
        options: ["10", "11", "12", "13"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 4,
        questionText: "Welche Farbe hat die Fußmatte im Badezimmer?",
        options: ["Blau", "Grau", "Schwarz", "Grün gemustert"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 5,
        questionText: "Sieh dir das Haupt-Bücherregal an. Was ist der Titel des dritten Buchs von links im zweiten Fach von oben?",
        options: ["Der Herr der Ringe", "Per Anhalter durch die Galaxis", "Clean Code", "Die Känguru-Chroniken"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
        nextStationCode: "PFLANZE"
    },
    {
        id: 6,
        questionText: "Welche Zahl steht *ganz unten* auf dem Etikett des WLAN-Routers?",
        options: ["192.168.0.1", "SN: 45A...", "Model: X-123", "P-CODE: 9982"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 7,
        questionText: "Wie ist der *genaue* Name des Bluetooth-Lautsprechers, über den gerade die Musik läuft?",
        options: ["JBL Charge 5", "Sonos Roam", "Wohnzimmer-Box", "Bose SoundLink"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 8,
        questionText: "Finde die Mikrowelle. Welche Watt-Zahl ist die *höchste* Einstellung?",
        options: ["700W", "800W", "900W", "1000W"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 9,
        questionText: "Wie viele Stühle (Sessel, Hocker, Sofa-Sitzplätze zählen *nicht*) stehen um den Esstisch?",
        options: ["3", "4", "5", "6"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 10,
        questionText: "Was ist das *erste* Zutatenwort auf der Packung der (z.B. Linsen-)Chips auf dem Tisch?",
        options: ["Kartoffelpulver", "Linsenmehl", "Maismehl", "Weizenmehl"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
        nextStationCode: "SPIEGEL"
    },
    {
        id: 11,
        questionText: "Geh zum größten Spiegel in der Wohnung. Welcher Gegenstand spiegelt sich *genau* in der Mitte?",
        options: ["Die Stehlampe", "Der Türrahmen", "Das Sofa", "Die Deckenlampe"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 12,
        questionText: "Auf welche *genaue* Temperatur ist der Heizkörper-Thermostat im Wohnzimmer eingestellt?",
        options: ["Stufe 2.5", "Stufe 3", "20°C", "21.5°C"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 13,
        questionText: "Finde die Kaffeemaschine. Welcher Herstellername steht darauf?",
        options: ["De'Longhi", "Siemens", "Jura", "Nespresso"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 14,
        questionText: "Schau dir die (z.B. 'Monstera') Pflanze am Fenster an. Wie viele Blätter hat sie *insgesamt*?",
        options: ["7", "8", "9", "10"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 15,
        questionText: "Was ist der *Titel* der aktuellen Spotify-Playlist, die läuft?",
        options: ["Party Mix", "Gute Laune", "Dinner Vibes", "Beste Hits"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 16,
        questionText: "Welches Mindesthaltbarkeitsdatum (MHD) steht auf der Milchpackung im Kühlschrank?",
        options: ["30.10.", "01.11.", "03.11.", "05.11."], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 17,
        questionText: "Finde das Spiel 'Siedler von Catan' im Regal. Welche Farbe hat die 'Räuber'-Figur?",
        options: ["Rot", "Schwarz", "Grau", "Weiß"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
    },
    {
        id: 18,
        questionText: "Wie lauten die *ersten zwei Worte* auf dem Zettel, der an der Pinnwand hängt?",
        options: ["Nicht vergessen:", "Einkaufsliste:", "Termin:", "CODE:"], // Anpassen!
        correctAnswerIndex: 0, // Anpassen!
        nextStationCode: "FINALCODE"
    },
    {
        id: 19,
        questionText: "Dieses Rätsel wird erst um 22:00 Uhr freigeschaltet. Was passiert dann?",
        options: ["Der Gastgeber macht Shots", "Die Musik wird lauter", "Es gibt Nachtisch", "Das nächste Rätsel erscheint"], // Anpassen!
        correctAnswerIndex: 3, // Anpassen!
        timeLock: "2025-10-31T22:00:00+01:00" // Beispiel-Zeitstempel (anpassen!)
    },
    {
        id: 20, // Finale Frage
        questionText: "Kombiniere die Codes: KUEHLSCHRANK + PFLANZE + SPIEGEL + FINALCODE. Wie lautet der Code für die Schatzkiste?",
        options: ["...", "...", "...", "..."], // Anpassen! (z.B. "SONNE-BLATT-BLAU-1234")
        correctAnswerIndex: 0, // Anpassen!
        finalRevealText: "Der Schatz ist im Gefrierschrank!"
    }
];

export const getQuestionById = (id: number): Question | undefined => {
    return questions.find(q => q.id === id);
};

export const getTotalStations = (): number => {
    return questions.length;
};