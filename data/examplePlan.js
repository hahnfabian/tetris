export const examplePlan = [{"number":"1","courses":[{"id":"course-SE1","short_name":"SE1","name":"Softwareentwicklung I","credits":"6","credits_needed":"0","semester":"winter","intendedSemester":"1","prerequisites":[],"isElective":false,"color":"rgb(117, 159, 236)","isFreieWahl":false,"recommended_prerequisites":[],"classnames":"course"},{"id":"course-IKON","short_name":"IKON","name":"Informatik im Kontext","credits":"6","credits_needed":"0","semester":"winter","intendedSemester":"1","prerequisites":[],"isElective":false,"color":"rgb(117, 159, 236)","isFreieWahl":false,"recommended_prerequisites":[],"classnames":"course"},{"id":"course-DM","short_name":"DM","name":"Diskrete Mathematik","credits":"9","credits_needed":"0","semester":"winter","intendedSemester":"1","prerequisites":[],"isElective":false,"color":"rgb(84, 253, 253)","isFreieWahl":false,"recommended_prerequisites":[],"classnames":"course"},{"id":"course-RSB","short_name":"RSB","name":"Rechnerstrukturen und Betriebssysteme","credits":"9","credits_needed":"0","semester":"winter","intendedSemester":"1","prerequisites":[],"isElective":false,"color":"rgb(196, 203, 209)","isFreieWahl":false,"recommended_prerequisites":[],"classnames":"course"}]},{"number":"2","courses":[{"id":"course-SE2","short_name":"SE2","name":"Softwareentwicklung II","credits":"6","credits_needed":"0","semester":"summer","intendedSemester":"2","prerequisites":[],"isElective":false,"color":"rgb(117, 159, 236)","isFreieWahl":false,"recommended_prerequisites":["SE1"],"classnames":"course"},{"id":"course-ALA","short_name":"ALA","name":"Analysis und Lineare Algebra","credits":"9","credits_needed":"0","semester":"summer","intendedSemester":"2","prerequisites":[],"isElective":false,"color":"rgb(84, 253, 253)","isFreieWahl":false,"recommended_prerequisites":["DM"],"classnames":"course"},{"id":"course-Pros","short_name":"Pros","name":"Proseminar","credits":"3","credits_needed":"0","semester":"both","intendedSemester":"2","prerequisites":[],"isElective":false,"color":"rgb(239, 253, 178)","isFreieWahl":false,"recommended_prerequisites":[],"classnames":"course"},{"id":"course-VSS","short_name":"VSS","name":"Verteilte Systeme und Systemsicherheit","credits":"6","credits_needed":"0","semester":"summer","intendedSemester":"2","prerequisites":[],"isElective":false,"color":"rgb(196, 203, 209)","isFreieWahl":false,"recommended_prerequisites":["SE1"],"classnames":"course"},{"id":"course-ETI","short_name":"ETI","name":"Einführung in die Theoretische Informatik","credits":"6","credits_needed":"0","semester":"summer","intendedSemester":"2","prerequisites":[],"isElective":false,"color":"rgb(84, 253, 253)","isFreieWahl":false,"recommended_prerequisites":["SE1"],"classnames":"course"}]},{"number":"3","courses":[{"id":"course-AD","short_name":"AD","name":"Algorithmen und Datenstrukturen","credits":"6","credits_needed":"0","semester":"winter","intendedSemester":"3","prerequisites":[],"isElective":false,"color":"rgb(84, 253, 253)","isFreieWahl":false,"recommended_prerequisites":["ETI","DM","SE1","SE2"],"classnames":"course"},{"id":"course-MK","short_name":"MK","name":"Methodenkompetenz","credits":"3","credits_needed":"0","semester":"both","intendedSemester":"3","prerequisites":[],"isElective":false,"color":"rgb(239, 253, 178)","isFreieWahl":false,"recommended_prerequisites":[],"classnames":"course"},{"id":"course-EML","short_name":"EML","name":"Einführung in das Maschinelle Lernen","credits":"6","credits_needed":"0","semester":"winter","intendedSemester":"null","prerequisites":["DM"],"isElective":true,"color":"rgb(255, 255, 255)","isFreieWahl":false,"recommended_prerequisites":["ALA","AD","SE1"],"classnames":"course"},{"id":"course-GDB","short_name":"GDB","name":"Grundlagen von Datenbanken","credits":"6","credits_needed":"0","semester":"winter","intendedSemester":"null","prerequisites":[],"isElective":true,"color":"rgb(255, 255, 255)","isFreieWahl":false,"recommended_prerequisites":["ETI","SE1","SE2"],"classnames":"course"},{"id":"course-HLR","short_name":"HLR","name":"Hochleistungsrechnen","credits":"9","credits_needed":"0","semester":"winter","intendedSemester":"null","prerequisites":["SE1"],"isElective":true,"color":"rgb(255, 255, 255)","isFreieWahl":false,"recommended_prerequisites":["VSS","SE1","SE2"],"classnames":"course"}]},{"number":"4","courses":[{"id":"course-BKA","short_name":"BKA","name":"Berechenbarkeit, Komplexität und Approximation","credits":"6","credits_needed":"0","semester":"summer","intendedSemester":"4","prerequisites":[],"isElective":false,"color":"rgb(84, 253, 253)","isFreieWahl":false,"recommended_prerequisites":["ETI","ALA"],"classnames":"course"},{"id":"course-Stoch1","short_name":"Stoch1","name":"Stochastik 1","credits":"6","credits_needed":"0","semester":"summer","intendedSemester":"4","prerequisites":[],"isElective":false,"color":"rgb(84, 253, 253)","isFreieWahl":false,"recommended_prerequisites":["ALA"],"classnames":"course"},{"id":"course-Prak","short_name":"Prak","name":"Praktikum","credits":"6","credits_needed":"51","semester":"both","intendedSemester":"4","prerequisites":["SE1"],"isElective":false,"color":"rgb(255, 154, 108)","isFreieWahl":false,"recommended_prerequisites":["SE2"],"classnames":"course"},{"id":"course-DAIS","short_name":"DAIS","name":"Data-driven Intelligent Systems","credits":"9","credits_needed":"51","semester":"summer","intendedSemester":"null","prerequisites":["SE1","SE2","ETI"],"isElective":true,"color":"rgb(255, 255, 255)","isFreieWahl":false,"recommended_prerequisites":["AD","SE1","SE2"],"classnames":"course"},{"id":"course-DIG","short_name":"DIG","name":"Datenschutz in der Informationsgesellschaft","credits":"3","credits_needed":"0","semester":"summer","intendedSemester":"null","prerequisites":[],"isElective":true,"color":"rgb(255, 255, 255)","isFreieWahl":false,"recommended_prerequisites":[],"classnames":"course"}]},{"number":"5","courses":[{"id":"course-Proj","short_name":"Proj","name":"Projekt","credits":"9","credits_needed":"80","semester":"both","intendedSemester":"5","prerequisites":["SE1","SE2","Pros","Prak"],"isElective":false,"color":"rgb(255, 154, 108)","isFreieWahl":false,"recommended_prerequisites":[],"classnames":"course"},{"id":"course-Sem","short_name":"Sem","name":"Seminar","credits":"3","credits_needed":"51","semester":"both","intendedSemester":"5","prerequisites":["Pros"],"isElective":false,"color":"rgb(255, 154, 108)","isFreieWahl":false,"recommended_prerequisites":[],"classnames":"course"},{"id":"course-OPT","short_name":"OPT","name":"Optimierung für Studierende der Informatik","credits":"6","credits_needed":"0","semester":"winter","intendedSemester":"null","prerequisites":[],"isElective":true,"color":"rgb(255, 255, 255)","isFreieWahl":false,"recommended_prerequisites":["ALA"],"classnames":"course"},{"id":"course-PM","short_name":"PM","name":"Projektmanagement","credits":"3","credits_needed":"0","semester":"winter","intendedSemester":"null","prerequisites":[],"isElective":true,"color":"rgb(255, 255, 255)","isFreieWahl":false,"recommended_prerequisites":["SE1","SE2"],"classnames":"course"},{"id":"course-3 LP","short_name":"3 LP","name":"Freie Wahl Beispiel 3 LP","credits":"3","credits_needed":"0","semester":"both","intendedSemester":"null","prerequisites":[],"isElective":false,"color":"rgb(255, 204, 130)","isFreieWahl":true,"recommended_prerequisites":[],"classnames":"course"},{"id":"course-6 LP","short_name":"6 LP","name":"Freie Wahl Beispiel 6 LP","credits":"6","credits_needed":"0","semester":"both","intendedSemester":"null","prerequisites":[],"isElective":false,"color":"rgb(255, 204, 130)","isFreieWahl":true,"recommended_prerequisites":[],"classnames":"course"}]},{"number":"6","courses":[{"id":"course-Abschlussmodul","short_name":"Abschlussmodul","name":"Abschlussmodul","credits":"12","credits_needed":"0","semester":"both","intendedSemester":"6","prerequisites":["SE1","RSB","DM","ALA","VSS","SE2","ETI","Pros","AD","MK","BKA","Stoch1","Prak"],"isElective":false,"color":"rgb(236, 147, 147)","isFreieWahl":false,"recommended_prerequisites":[],"classnames":"course"},{"id":"course-BV","short_name":"BV","name":"Einführung in die Bildverarbeitung","credits":"6","credits_needed":"0","semester":"summer","intendedSemester":"null","prerequisites":[],"isElective":true,"color":"rgb(255, 255, 255)","isFreieWahl":false,"recommended_prerequisites":["SE1"],"classnames":"course"},{"id":"course-UrhR","short_name":"UrhR","name":"Urheberrecht in der Informationsgesellschaft","credits":"3","credits_needed":"0","semester":"summer","intendedSemester":"null","prerequisites":[],"isElective":true,"color":"rgb(255, 255, 255)","isFreieWahl":false,"recommended_prerequisites":[],"classnames":"course"},{"id":"course-9 LP","short_name":"9 LP","name":"Freie Wahl Beispiel 9 LP","credits":"9","credits_needed":"0","semester":"both","intendedSemester":"null","prerequisites":[],"isElective":false,"color":"rgb(255, 204, 130)","isFreieWahl":true,"recommended_prerequisites":[],"classnames":"course"}]},{"number":"7","courses":[]}]