
/*
===========================================
V.P.S. ELEKTRO - VÝROBNÍ KARTA HRÁČE
Soubor: choices.js
===========================================

Centrální ukládání rozhodnutí hráče.

Data jsou ukládána do localStorage.
Jednotlivé HTML stránky používají
funkce VPSChoices.

===========================================
*/

const VPSChoices = (() => {

    const STORAGE_KEY = "vps_semafor_choices";

    // =====================================
    // 1. VÝCHOZÍ VÝROBNÍ KARTA
    // =====================================

    function createNewGame() {

        return {

            version: 1,

            sklad: {
                dokonceno: false,
                materialy: []
            },

            podavace: {
                dokonceno: false,

                programBottom: {
                    nacten: false,
                    slot: null,
                    material: null
                },

                programTop: {
                    nacten: false,
                    sloty: {}
                },

                fyzickyMaterial: {
                    1: null,
                    2: null,
                    3: null
                }
            },

            pastaBottom: {
                dokonceno: false,
                rozhodnuti: {}
            },

            osazeniBottom: {
                dokonceno: false,
                soucastky: {}
            },

            reflowBottom: {
                dokonceno: false,
                rozhodnuti: {}
            },

            pastaTop: {
                dokonceno: false,
                rozhodnuti: {}
            },

            osazeniTopSMD: {
                dokonceno: false,
                soucastky: {}
            },

            reflowTop: {
                dokonceno: false,
                rozhodnuti: {}
            },

            osazeniTopTHT: {
                dokonceno: false,
                soucastky: {}
            },

            pajeniTop: {
                dokonceno: false,
                rozhodnuti: {}
            },

            zkouska: {
                dokonceno: false,
                vysledek: null
            }

        };
    }


    // =====================================
    // 2. NAČTENÍ VÝROBNÍ KARTY
    // =====================================

    function load() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return createNewGame();
            }

            const parsed = JSON.parse(saved);

            if (
                !parsed ||
                typeof parsed !== "object" ||
                Array.isArray(parsed)
            ) {
                return createNewGame();
            }

            return parsed;

        } catch (error) {

            console.error(
                "Nepodařilo se načíst výrobní kartu.",
                error
            );

            return createNewGame();
        }
    }


    // =====================================
    // 3. ULOŽENÍ VÝROBNÍ KARTY
    // =====================================

    function save(data) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error(
                "Nepodařilo se uložit výrobní kartu.",
                error
            );

            return false;
        }
    }


    // =====================================
    // 4. ULOŽENÍ JEDNÉ VÝROBNÍ OPERACE
    // =====================================

    function saveStep(stepName, stepData) {

        const data = load();

        if (
            !Object.prototype.hasOwnProperty.call(
                data, stepName
            )
        ) {
            console.warn(
                "Neznámá výrobní operace:",
                stepName
            );

            return false;
        }

        data[stepName] = {
            ...data[stepName],
            ...stepData
        };

        return save(data);
    }


    // =====================================
    // 5. NAČTENÍ JEDNÉ VÝROBNÍ OPERACE
    // =====================================

    function getStep(stepName) {

        const data = load();

        return data[stepName] || null;
    }


    // =====================================
    // 6. OZNAČENÍ DOKONČENÉ OPERACE
    // =====================================

    function completeStep(stepName) {

        const data = load();

        if (!data[stepName]) {
            return false;
        }

        data[stepName].dokonceno = true;

        return save(data);
    }


    // =====================================
    // 7. ZJIŠTĚNÍ STAVU OPERACE
    // =====================================

    function isCompleted(stepName) {

        const step = getStep(stepName);

        return step
            ? step.dokonceno === true
            : false;
    }


    // =====================================
    // 8. EXPORT VÝROBNÍ KARTY
    // =====================================

    function exportData() {

        const data = load();

        const json = JSON.stringify(
            data,
            null,
            2
        );

        const blob = new Blob(
            [json],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "choices.json";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }


    // =====================================
    // 9. RESET CELÉ HRY
    // =====================================

    function reset() {

        // Smazání centrální výrobní karty.
        localStorage.removeItem(STORAGE_KEY);

        // Smazání starších ukládacích klíčů,
        // které používají dosavadní HTML stránky.

        Object.keys(localStorage)
            .filter(key =>
                key.startsWith("vps_semafor_")
            )
            .forEach(key =>
                localStorage.removeItem(key)
            );

        return save(createNewGame());
    }


    // =====================================
    // 10. VEŘEJNÉ FUNKCE
    // =====================================

    return {
        load,
        save,
        saveStep,
        getStep,
        completeStep,
        isCompleted,
        exportData,
        reset
    };

})();
