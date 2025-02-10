export const aufteilung = {
    "menge_wahlpflicht": 48,
    "menge_freie_wahl": 18
}

export const courses = [
    {
        "short_name": "SE1",
        "name": "Softwareentwicklung I",
        "credits": 6,
        "semester": "winter",
        "intended_semester": 1,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#759fec",
        "recommended_prerequisites": []
    },
    {
        "short_name": "IKON",
        "name": "Informatik im Kontext",
        "credits": 6,
        "semester": "winter",
        "intended_semester": 1,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#759fec",
        "recommended_prerequisites": []
    },
    {
        "short_name": "DM",
        "name": "Discrete Mathematics",
        "credits": 9,
        "semester": "winter",
        "intended_semester": 1,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#54fdfd",
        "recommended_prerequisites": []
    },
    {
        "short_name": "RSB",
        "name": "Rechnerstrukturen und Betriebssysteme",
        "credits": 9,
        "semester": "winter",
        "intended_semester": 1,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#c4cbd1",
        "recommended_prerequisites": []
    },
    {
        "short_name": "SE2",
        "name": "Softwareentwicklung II",
        "credits": 6,
        "semester": "summer",
        "intended_semester": 2,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#759fec",
        "recommended_prerequisites": ["SE1"]
    },
    {
        "short_name": "ALA",
        "name": "Algorithmen und Datenstrukturen",
        "credits": 9,
        "semester": "summer",
        "intended_semester": 2,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#54fdfd",
        "recommended_prerequisites": ["DM"]
    },
    {
        "short_name": "Pros",
        "name": "Proseminar",
        "credits": 3,
        "semester": "both",
        "intended_semester": 2,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#effdb2",
        "recommended_prerequisites": []
    },
    {
        "short_name": "VSS",
        "name": "Verteilte Systeme und Systemsicherheit",
        "credits": 6,
        "semester": "summer",
        "intended_semester": 2,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#c4cbd1",
        "recommended_prerequisites": ["SE1"]
    },
    {
        "short_name": "ETI",
        "name": "Einführung in die Theoretische Informatik",
        "credits": 6,
        "semester": "summer",
        "intended_semester": 2,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#54fdfd",
        "recommended_prerequisites": ["SE1"]
    },
    {
        "short_name": "AD",
        "name": "Algorithmen und Datenstrukturen",
        "credits": 6,
        "semester": "winter",
        "intended_semester": 3,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#54fdfd",
        "recommended_prerequisites": ["ETI", "DM", "SE1", "SE2"]
    },
    {
        "short_name": "MK",
        "name": "Methodenkompetenz",
        "credits": 3,
        "semester": "both",
        "intended_semester": 3,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#effdb2",
        "recommended_prerequisites": []
    },
    {
        "short_name": "BKA",
        "name": "Berechenbarkeit, Komplexität und Approximation",
        "credits": 6,
        "semester": "summer",
        "intended_semester": 4,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#54fdfd",
        "recommended_prerequisites": ["ETI", "ALA"]
    },
    {
        "short_name": "Stoch1",
        "name": "Stochastik 1",
        "credits": 6,
        "semester": "summer",
        "intended_semester": 4,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": false,
        "color": "#54fdfd",
        "recommended_prerequisites": ["ALA"]
    },
    {
        "short_name": "Prak",
        "name": "Praktikum",
        "credits": 6,
        "semester": "both",
        "intended_semester": 4,
        "prerequisites": ["SE1"],
        "credits_needed": 51,
        "elective": false,
        "color": "#ff9a6c",
        "recommended_prerequisites": ["SE2"]
    },
    {
        "short_name": "Proj",
        "name": "Projekt",
        "credits": 9,
        "semester": "both",
        "intended_semester": 5,
        "prerequisites": ["SE1", "SE2", "Pros", "Prak"],
        "credits_needed": 80,
        "elective": false,
        "color": "#ff9a6c",
        "recommended_prerequisites": []
    },
    {
        "short_name": "Sem",
        "name": "Seminar",
        "credits": 3,
        "semester": "both",
        "intended_semester": 5,
        "prerequisites": ["Pros"],
        "credits_needed": 51,
        "elective": false,
        "color": "#ff9a6c",
        "recommended_prerequisites": []
    },
    {
        "short_name": "Abschlussmodul",
        "name": "Abschlussmodul",
        "credits": 12,
        "semester": "both",
        "intended_semester": 6,
        "prerequisites": ["SE1", "RSB", "DM", 
                          "ALA", "VSS", "SE2", "ETI", "Pros",
                          "AD", "MK", 
                          "BKA", "Stoch1", "Prak" ],
        "credits_needed": 0,
        "elective": false,
        "color": "#ec9393",
        "recommended_prerequisites": []
    },
    {
        "short_name": "ATI",
        "name": "Aktuelle Themen der Theoretischen Informatik",
        "credits": 6,
        "semester": "winter",
        "intended_semester": null,
        "prerequisites": ["AD"],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["BKA"]
    },
    {
        "short_name": "CN",
        "name": "Rechnernetze",
        "credits": 6,
        "semester": "winter",
        "intended_semester": null,
        "prerequisites": ["VSS"],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["SE1"]
    },
    {
        "short_name": "EML",
        "name": "Einführung in das Maschinelle Lernen",
        "credits": 6,
        "semester": "winter",
        "intended_semester": null,
        "prerequisites": ["DM"],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["ALA", "AD", "SE1"]
    },
    {
        "short_name": "GDB",
        "name": "Grundlagen von Datenbanken",
        "credits": 6,
        "semester": "winter",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["ETI", "SE1", "SE2"]
    },
    {
        "short_name": "ICG",
        "name": "Interaktive Computergrafik",
        "credits": 6,
        "semester": "winter",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["DM", "SE1"]
    },
    {
        "short_name": "HLR",
        "name": "Hochleistungsrechnen",
        "credits": 9,
        "semester": "winter",
        "intended_semester": null,
        "prerequisites": ["SE1"],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["VSS", "SE1", "SE2"]
    },
    {
        "short_name": "MAKS",
        "name": "Modellierung und Analyse komplexer Systeme",
        "credits": 9,
        "semester": "winter",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["ETI", "ALA", "SE1", "SE2"]
    },
    {
        "short_name": "PM",
        "name": "Projektmanagement",
        "credits": 3,
        "semester": "winter",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["SE1", "SE2"]
    },
    {
        "short_name": "OPT",
        "name": "Optimierung für Studierende der Informatik",
        "credits": 6,
        "semester": "winter",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["ALA"]
    },
    {
        "short_name": "STO2",
        "name": "Stochastik 2 für Studierende der Informatik",
        "credits": 6,
        "semester": "winter",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["Stoch1"]
    },
    {
        "short_name": "BV",
        "name": "Einführung in die Bildverarbeitung",
        "credits": 6,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["SE1"]
    },
    {
        "short_name": "DAIS",
        "name": "Data-driven Intelligent Systems",
        "credits": 9,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": ["SE1", "SE2", "ETI"],
        "credits_needed": 51,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["AD", "SE1", "SE2"]
    },
    {
        "short_name": "DIG",
        "name": "Datenschutz in der Informationsgesellschaft",
        "credits": 3,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": []
    },
    {
        "short_name": "DMSV",
        "name": "Digitale Mediensignalverarbeitung",
        "credits": 9,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": []
    },
    {
        "short_name": "DV",
        "name": "Datenvisualisierung und GPU-Computing",
        "credits": 6,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": ["SE1"],
        "credits_needed": 51,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["SE1", "SE2"]
    },
    {
        "short_name": "ES",
        "name": "Eingebettete Systeme",
        "credits": 9,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": ["RSB"],
        "credits_needed": 51,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": []
    },
    {
        "short_name": "ESM",
        "name": "Einführung in die System-Medizin – Mit Big Data gegen Krebs und Volkskrankheiten",
        "credits": 6,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": ["SE1", "SE2"],
        "credits_needed": 51,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["AD"]
    },
    {
        "short_name": "ID",
        "name": "Interaktionsdesign",
        "credits": 6,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": ["SE1", "SE2", "IKON"],
        "credits_needed": 51,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["DM"]
    },
    {
        "short_name": "IGMO",
        "name": "Informatikgestützte Gestaltung und Modellierung von Organisationen",
        "credits": 9,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": ["SE1", "SE2", "IKON"],
        "credits_needed": 51,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": []
    },
    {
        "short_name": "SEE",
        "name": "Software Engineering Einführung",
        "credits": 3,
        "semester": "summer",
        "intended_semester": 3,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["SE1", "SE2"]
    },
    {
        "short_name": "MOBS",
        "name": "Moderne Betriebssysteme",
        "credits": 6,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["RSB", "SE1"]
    },
    {
        "short_name": "PGIT",
        "name": "Philosophie, Gesellschaft und IT",
        "credits": 6,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["IKON"]
    },
    {
        "short_name": "SEW",
        "name": "Softwareentwurf",
        "credits": 6,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": ["SE1", "SE2"],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": ["SEE"]
    },
    {
        "short_name": "UrhR",
        "name": "Urheberrecht in der Informationsgesellschaft",
        "credits": 3,
        "semester": "summer",
        "intended_semester": null,
        "prerequisites": [],
        "credits_needed": 0,
        "elective": true,
        "color": "#ffffff",
        "recommended_prerequisites": []
    },
    {
        "short_name": "UrhR",
        "name": "Urheberrecht in der Informationsgesellschaft",    {
            "short_name": "UrhR",
            "name": "Urheberrecht in der Informationsgesellschaft",
            "credits": 3,
            "semester": "summer",
            "intended_semester": null,
            "prerequisites": [],
            "credits_needed": 0,
            "elective": true,
            "color": "#ffffff",
            "recommended_prerequisites": []
        },
      
];