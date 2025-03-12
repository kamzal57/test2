import { gsap } from 'gsap';

// Fonctions utilitaires
function roundToDecimal(number, places = 2) {
    return Number(Math.round(number + 'e' + places) + 'e-' + places);
}

function addStepsToResult(stepsElement, steps) {
    stepsElement.innerHTML = '';
    steps.forEach(step => {
        const stepEl = document.createElement('li');
        stepEl.innerHTML = step;
        stepsElement.appendChild(stepEl);
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.querySelector('p').textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showResult(resultId, isHidden = false) {
    const resultElement = document.getElementById(resultId);
    const resultCard = resultElement.querySelector('.result-card');
    
    if (isHidden) {
        resultCard.classList.add('hidden');
        return;
    }
    
    resultCard.classList.remove('hidden');
    
    // Animation avec GSAP
    gsap.fromTo(resultCard, 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
}

// Navigation et changement de section
function initNavigation() {
    const navButtons = document.querySelectorAll('.menu button');
    const sections = document.querySelectorAll('.math-section');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            
            // Mise à jour des boutons
            navButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            
            // Affichage de la section correspondante
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                    
                    // Animation d'entrée de la section
                    gsap.fromTo(section, 
                        { opacity: 0, y: 20 }, 
                        { opacity: 1, y: 0, duration: 0.5 }
                    );
                }
            });
            
            // Fermeture du menu sur mobile
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('open');
            }
        });
    });
    
    // Toggle menu mobile
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });
}

// Tabs pour les sous-sections
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabGroup = button.closest('.tabs');
            const tabContents = tabGroup.parentElement.querySelectorAll('.tab-content');
            const tabId = button.getAttribute('data-tab');
            
            // Mise à jour des boutons
            tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Affichage du contenu correspondant
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Fonctions pour Pythagore
function initPythagore() {
    const form = document.getElementById('pythagore-form');
    const searchOptions = form.querySelectorAll('input[name="pythagore-search"]');
    const inputA = document.getElementById('pythagore-a');
    const inputB = document.getElementById('pythagore-b');
    const inputC = document.getElementById('pythagore-c');
    
    // Gestion du changement de valeur recherchée
    searchOptions.forEach(option => {
        option.addEventListener('change', () => {
            const searchValue = option.value;
            
            // Réinitialisation
            [inputA, inputB, inputC].forEach(input => {
                input.parentElement.style.display = 'block';
                input.required = true;
            });
            
            // Adaptation en fonction de la valeur recherchée
            if (searchValue === 'a') {
                inputA.parentElement.style.display = 'none';
                inputA.required = false;
            } else if (searchValue === 'b') {
                inputB.parentElement.style.display = 'none';
                inputB.required = false;
            } else if (searchValue === 'c') {
                inputC.parentElement.style.display = 'none';
                inputC.required = false;
            }
        });
    });
    
    // Calcul de Pythagore
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const searchValue = form.querySelector('input[name="pythagore-search"]:checked').value;
        const a = parseFloat(inputA.value);
        const b = parseFloat(inputB.value);
        const c = parseFloat(inputC.value);
        
        const resultElement = document.getElementById('pythagore-result');
        const resultValue = resultElement.querySelector('.result-value');
        const resultFormula = resultElement.querySelector('.result-formula');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        let result;
        let formula;
        let steps = [];
        
        try {
            if (searchValue === 'c') {
                if (a <= 0 || b <= 0) throw new Error("Les longueurs doivent être positives");
                
                steps.push("Nous utilisons le théorème de Pythagore pour trouver l'hypoténuse c.");
                steps.push(`Dans un triangle rectangle, selon Pythagore : c² = a² + b²`);
                steps.push(`Étape 1 : Calculons les carrés des côtés a et b.`);
                steps.push(`a² = ${a} × ${a} = ${a*a}`);
                steps.push(`b² = ${b} × ${b} = ${b*b}`);
                steps.push(`Étape 2 : Additionnons les carrés.`);
                steps.push(`a² + b² = ${a*a} + ${b*b} = ${a*a + b*b}`);
                steps.push(`Étape 3 : Calculons la racine carrée pour trouver c.`);
                result = Math.sqrt(a*a + b*b);
                steps.push(`c = √(a² + b²) = √(${a*a + b*b}) = ${roundToDecimal(result)}`);
                steps.push(`L'hypoténuse du triangle rectangle mesure ${roundToDecimal(result)} unités.`);
                
                formula = `c = √(a² + b²) = √(${a}² + ${b}²) = √(${a*a} + ${b*b}) = ${roundToDecimal(result)}`;
            } else if (searchValue === 'a') {
                if (c <= 0 || b <= 0 || c <= b) throw new Error("Les longueurs doivent être positives et c > b");
                
                steps.push("Nous utilisons le théorème de Pythagore pour trouver le côté a.");
                steps.push(`Dans un triangle rectangle, selon Pythagore : a² + b² = c²`);
                steps.push(`Pour isoler a, nous réorganisons : a² = c² - b²`);
                steps.push(`Étape 1 : Calculons les carrés des côtés b et c.`);
                steps.push(`c² = ${c} × ${c} = ${c*c}`);
                steps.push(`b² = ${b} × ${b} = ${b*b}`);
                steps.push(`Étape 2 : Soustrayons b² de c².`);
                steps.push(`c² - b² = ${c*c} - ${b*b} = ${c*c - b*b}`);
                steps.push(`Étape 3 : Calculons la racine carrée pour trouver a.`);
                result = Math.sqrt(c*c - b*b);
                steps.push(`a = √(c² - b²) = √(${c*c - b*b}) = ${roundToDecimal(result)}`);
                steps.push(`Le côté a du triangle rectangle mesure ${roundToDecimal(result)} unités.`);
                
                formula = `a = √(c² - b²) = √(${c}² - ${b}²) = √(${c*c} - ${b*b}) = ${roundToDecimal(result)}`;
            } else if (searchValue === 'b') {
                if (c <= 0 || a <= 0 || c <= a) throw new Error("Les longueurs doivent être positives et c > a");
                
                steps.push("Nous utilisons le théorème de Pythagore pour trouver le côté b.");
                steps.push(`Dans un triangle rectangle, selon Pythagore : a² + b² = c²`);
                steps.push(`Pour isoler b, nous réorganisons : b² = c² - a²`);
                steps.push(`Étape 1 : Calculons les carrés des côtés a et c.`);
                steps.push(`c² = ${c} × ${c} = ${c*c}`);
                steps.push(`a² = ${a} × ${a} = ${a*a}`);
                steps.push(`Étape 2 : Soustrayons a² de c².`);
                steps.push(`c² - a² = ${c*c} - ${a*a} = ${c*c - a*a}`);
                steps.push(`Étape 3 : Calculons la racine carrée pour trouver b.`);
                result = Math.sqrt(c*c - a*a);
                steps.push(`b = √(c² - a²) = √(${c*c - a*a}) = ${roundToDecimal(result)}`);
                steps.push(`Le côté b du triangle rectangle mesure ${roundToDecimal(result)} unités.`);
                
                formula = `b = √(c² - a²) = √(${c}² - ${a}²) = √(${c*c} - ${a*a}) = ${roundToDecimal(result)}`;
            }
            
            resultValue.textContent = `${searchValue} = ${roundToDecimal(result)}`;
            resultFormula.textContent = formula;
            addStepsToResult(resultSteps, steps);
            showResult('pythagore-result');
        } catch (error) {
            resultValue.textContent = `Erreur: ${error.message}`;
            resultFormula.textContent = "";
            resultSteps.innerHTML = "";
            showResult('pythagore-result');
        }
    });
    
    form.addEventListener('reset', () => {
        showResult('pythagore-result', true);
    });
}

// Fonctions pour Thalès
function initThales() {
    const form = document.getElementById('thales-form');
    const searchOptions = form.querySelectorAll('input[name="thales-search"]');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const oa = parseFloat(document.getElementById('thales-oa').value);
        const ob = parseFloat(document.getElementById('thales-ob').value);
        const ab = parseFloat(document.getElementById('thales-ab').value);
        const searchValue = form.querySelector('input[name="thales-search"]:checked').value;
        
        const resultElement = document.getElementById('thales-result');
        const resultValue = resultElement.querySelector('.result-value');
        const resultFormula = resultElement.querySelector('.result-formula');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (oa <= 0 || ob <= 0 || ab <= 0) {
                throw new Error("Toutes les valeurs doivent être positives");
            }
            
            let result, formula;
            let steps = [];
            
            if (searchValue === 'oa-prime') {
                const oaPrime = parseFloat(document.getElementById('thales-ob-prime').value);
                
                steps.push("Nous appliquons le théorème de Thalès pour trouver OA'.");
                steps.push(`Selon Thalès, dans deux triangles semblables : OA/OA' = OB/OB' = AB/A'B'`);
                steps.push(`Étape 1 : Utilisons le rapport OB/OB' pour trouver OA'.`);
                steps.push(`OB/OB' = OA/OA', donc OA' = (OA × OB') / OB`);
                steps.push(`Étape 2 : Substituons nos valeurs.`);
                steps.push(`OA' = (${oa} × ${oaPrime}) / ${ob}`);
                steps.push(`Étape 3 : Effectuons le calcul.`);
                result = (oa * oaPrime) / ob;
                steps.push(`OA' = ${oa * oaPrime} / ${ob} = ${roundToDecimal(result)}`);
                steps.push(`La longueur OA' est ${roundToDecimal(result)} unités.`);
                
                formula = `OA' = (OA × OB') / OB = (${oa} × ${oaPrime}) / ${ob} = ${roundToDecimal(result)}`;
            } else if (searchValue === 'ob-prime') {
                const oaPrime = parseFloat(document.getElementById('thales-oa-prime').value);
                
                steps.push("Nous appliquons le théorème de Thalès pour trouver OB'.");
                steps.push(`Selon Thalès, dans deux triangles semblables : OA/OA' = OB/OB' = AB/A'B'`);
                steps.push(`Étape 1 : Utilisons le rapport OA/OA' pour trouver OB'.`);
                steps.push(`OA/OA' = OB/OB', donc OB' = (OB × OA') / OA`);
                steps.push(`Étape 2 : Substituons nos valeurs.`);
                steps.push(`OB' = (${ob} × ${oaPrime}) / ${oa}`);
                steps.push(`Étape 3 : Effectuons le calcul.`);
                result = (ob * oaPrime) / oa;
                steps.push(`OB' = ${ob * oaPrime} / ${oa} = ${roundToDecimal(result)}`);
                steps.push(`La longueur OB' est ${roundToDecimal(result)} unités.`);
                
                formula = `OB' = (OB × OA') / OA = (${ob} × ${oaPrime}) / ${oa} = ${roundToDecimal(result)}`;
            } else if (searchValue === 'ab-prime') {
                const oaPrime = parseFloat(document.getElementById('thales-oa-prime').value);
                
                steps.push("Nous appliquons le théorème de Thalès pour trouver A'B'.");
                steps.push(`Selon Thalès, dans deux triangles semblables : OA/OA' = OB/OB' = AB/A'B'`);
                steps.push(`Étape 1 : Utilisons le rapport OA/OA' pour trouver A'B'.`);
                steps.push(`OA/OA' = AB/A'B', donc A'B' = (AB × OA') / OA`);
                steps.push(`Étape 2 : Substituons nos valeurs.`);
                steps.push(`A'B' = (${ab} × ${oaPrime}) / ${oa}`);
                steps.push(`Étape 3 : Effectuons le calcul.`);
                result = (ab * oaPrime) / oa;
                steps.push(`A'B' = ${ab * oaPrime} / ${oa} = ${roundToDecimal(result)}`);
                steps.push(`La longueur A'B' est ${roundToDecimal(result)} unités.`);
                
                formula = `A'B' = (AB × OA') / OA = (${ab} × ${oaPrime}) / ${oa} = ${roundToDecimal(result)}`;
            }
            
            resultValue.textContent = `${searchValue === 'oa-prime' ? 'OA\'' : searchValue === 'ob-prime' ? 'OB\'' : 'A\'B\''} = ${roundToDecimal(result)}`;
            resultFormula.textContent = formula;
            addStepsToResult(resultSteps, steps);
            showResult('thales-result');
        } catch (error) {
            resultValue.textContent = `Erreur: ${error.message}`;
            resultFormula.textContent = "";
            resultSteps.innerHTML = "";
            showResult('thales-result');
        }
    });
    
    form.addEventListener('reset', () => {
        showResult('thales-result', true);
    });
}

// Fonctions pour les équations
function initEquations() {
    const form = document.getElementById('equations-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const a = parseFloat(document.getElementById('equations-a').value);
        const b = parseFloat(document.getElementById('equations-b').value);
        
        const resultElement = document.getElementById('equations-result');
        const resultValue = resultElement.querySelector('.result-value');
        const resultFormula = resultElement.querySelector('.result-formula');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            let steps = [];
            
            steps.push(`Nous voulons résoudre l'équation ${a}x + ${b} = 0.`);
            
            if (a === 0) {
                if (b === 0) {
                    steps.push(`Dans cette équation, le coefficient de x est nul (a = 0) et le terme constant est nul (b = 0).`);
                    steps.push(`L'équation devient : 0x + 0 = 0, ce qui est toujours vrai.`);
                    steps.push(`Puisque cette égalité est vérifiée pour n'importe quelle valeur de x, l'équation admet une infinité de solutions.`);
                    
                    resultValue.textContent = "L'équation admet une infinité de solutions";
                    resultFormula.textContent = "0x + 0 = 0 est vérifiée pour tout x";
                } else {
                    steps.push(`Dans cette équation, le coefficient de x est nul (a = 0) mais le terme constant n'est pas nul (b = ${b}).`);
                    steps.push(`L'équation devient : 0x + ${b} = 0, ce qui équivaut à ${b} = 0.`);
                    steps.push(`Puisque ${b} ≠ 0, cette égalité n'est jamais vérifiée.`);
                    steps.push(`L'équation n'admet donc aucune solution.`);
                    
                    resultValue.textContent = "L'équation n'admet pas de solution";
                    resultFormula.textContent = `0x + ${b} = 0 n'est jamais vérifiée`;
                }
            } else {
                steps.push(`Étape 1 : Isolons le terme avec x d'un côté de l'équation.`);
                steps.push(`${a}x + ${b} = 0`);
                steps.push(`${a}x = -${b}`);
                
                steps.push(`Étape 2 : Divisons les deux membres par ${a} pour isoler x.`);
                steps.push(`x = -${b} / ${a}`);
                
                const solution = -b / a;
                steps.push(`x = ${roundToDecimal(solution)}`);
                
                steps.push(`Vérification : Remplaçons x par ${roundToDecimal(solution)} dans l'équation d'origine.`);
                steps.push(`${a} × (${roundToDecimal(solution)}) + ${b} = ${roundToDecimal(a * solution + b)}`);
                steps.push(`La solution est bien x = ${roundToDecimal(solution)}`);
                
                resultValue.textContent = `x = ${roundToDecimal(solution)}`;
                resultFormula.textContent = `${a}x + ${b} = 0 ⟹ ${a}x = ${-b} ⟹ x = ${-b} / ${a} = ${roundToDecimal(solution)}`;
            }
            
            addStepsToResult(resultSteps, steps);
            showResult('equations-result');
        } catch (error) {
            resultValue.textContent = `Erreur: ${error.message}`;
            resultFormula.textContent = "";
            resultSteps.innerHTML = "";
            showResult('equations-result');
        }
    });
    
    form.addEventListener('reset', () => {
        showResult('equations-result', true);
    });
}

// Fonctions pour les probabilités
function initProbabilites() {
    // Probabilité simple
    const simpleForm = document.getElementById('proba-simple-form');
    simpleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const favorable = parseInt(document.getElementById('proba-simple-favorable').value);
        const possible = parseInt(document.getElementById('proba-simple-possible').value);
        
        const resultElement = document.getElementById('proba-simple-result');
        const resultValue = resultElement.querySelector('.result-value');
        const resultFormula = resultElement.querySelector('.result-formula');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (favorable < 0 || possible <= 0) {
                throw new Error("Les valeurs doivent être positives et le nombre de cas possibles doit être strictement positif");
            }
            
            if (favorable > possible) {
                throw new Error("Le nombre de cas favorables ne peut pas dépasser le nombre de cas possibles");
            }
            
            const probability = favorable / possible;
            let steps = [];
            
            steps.push(`Nous voulons calculer la probabilité de l'événement A.`);
            steps.push(`Rappel : La probabilité d'un événement A est définie par : P(A) = Nombre de cas favorables / Nombre de cas possibles`);
            steps.push(`Étape 1 : Identifions les données du problème.`);
            steps.push(`Nombre de cas favorables à A : ${favorable}`);
            steps.push(`Nombre de cas possibles : ${possible}`);
            steps.push(`Étape 2 : Appliquons la formule.`);
            steps.push(`P(A) = ${favorable} / ${possible} = ${probability}`);
            steps.push(`Étape 3 : Convertissons en pourcentage.`);
            steps.push(`P(A) = ${probability} = ${Math.round(probability * 100)}%`);
            
            resultValue.textContent = `P(A) = ${probability} = ${Math.round(probability * 100)}%`;
            resultFormula.textContent = `P(A) = ${favorable} / ${possible} = ${probability}`;
            addStepsToResult(resultSteps, steps);
            
            showResult('proba-simple-result');
        } catch (error) {
            resultValue.textContent = `Erreur: ${error.message}`;
            resultFormula.textContent = "";
            resultSteps.innerHTML = "";
            showResult('proba-simple-result');
        }
    });
    
    simpleForm.addEventListener('reset', () => {
        showResult('proba-simple-result', true);
    });
    
    // Probabilité complémentaire
    const complementForm = document.getElementById('proba-complement-form');
    complementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const eventProba = parseFloat(document.getElementById('proba-complement-event').value);
        
        const resultElement = document.getElementById('proba-complement-result');
        const resultValue = resultElement.querySelector('.result-value');
        const resultFormula = resultElement.querySelector('.result-formula');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (eventProba < 0 || eventProba > 1) {
                throw new Error("La probabilité doit être comprise entre 0 et 1");
            }
            
            const complementProba = 1 - eventProba;
            let steps = [];
            
            steps.push(`Nous voulons calculer la probabilité de l'événement contraire (non A).`);
            steps.push(`Rappel : La probabilité de l'événement contraire est définie par : P(non A) = 1 - P(A)`);
            steps.push(`Étape 1 : Identifions la probabilité de l'événement A.`);
            steps.push(`P(A) = ${eventProba}`);
            steps.push(`Étape 2 : Appliquons la formule.`);
            steps.push(`P(non A) = 1 - P(A) = 1 - ${eventProba} = ${complementProba}`);
            steps.push(`Étape 3 : Convertissons en pourcentage.`);
            steps.push(`P(non A) = ${complementProba} = ${Math.round(complementProba * 100)}%`);
            
            resultValue.textContent = `P(non A) = ${complementProba} = ${Math.round(complementProba * 100)}%`;
            resultFormula.textContent = `P(non A) = 1 - P(A) = 1 - ${eventProba} = ${complementProba}`;
            addStepsToResult(resultSteps, steps);
            
            showResult('proba-complement-result');
        } catch (error) {
            resultValue.textContent = `Erreur: ${error.message}`;
            resultFormula.textContent = "";
            resultSteps.innerHTML = "";
            showResult('proba-complement-result');
        }
    });
    
    complementForm.addEventListener('reset', () => {
        showResult('proba-complement-result', true);
    });
    
    // Probabilité conditionnelle
    const conditionalForm = document.getElementById('proba-conditional-form');
    conditionalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const jointProba = parseFloat(document.getElementById('proba-conditional-joint').value);
        const bProba = parseFloat(document.getElementById('proba-conditional-b').value);
        
        const resultElement = document.getElementById('proba-conditional-result');
        const resultValue = resultElement.querySelector('.result-value');
        const resultFormula = resultElement.querySelector('.result-formula');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (jointProba < 0 || jointProba > 1 || bProba < 0 || bProba > 1) {
                throw new Error("Les probabilités doivent être comprises entre 0 et 1");
            }
            
            if (jointProba > bProba) {
                throw new Error("P(A ∩ B) ne peut pas être supérieur à P(B)");
            }
            
            if (bProba === 0) {
                throw new Error("P(B) ne peut pas être égal à 0 (division par zéro)");
            }
            
            const conditionalProba = jointProba / bProba;
            let steps = [];
            
            steps.push(`Nous voulons calculer la probabilité conditionnelle P(A|B).`);
            steps.push(`Rappel : La probabilité conditionnelle est définie par : P(A|B) = P(A ∩ B) / P(B)`);
            steps.push(`Étape 1 : Identifions les probabilités.`);
            steps.push(`P(A ∩ B) = ${jointProba}`);
            steps.push(`P(B) = ${bProba}`);
            steps.push(`Étape 2 : Appliquons la formule.`);
            steps.push(`P(A|B) = ${jointProba} / ${bProba} = ${conditionalProba}`);
            steps.push(`Étape 3 : Convertissons en pourcentage.`);
            steps.push(`P(A|B) = ${conditionalProba} = ${Math.round(conditionalProba * 100)}%`);
            
            resultValue.textContent = `P(A|B) = ${roundToDecimal(conditionalProba)} = ${Math.round(conditionalProba * 100)}%`;
            resultFormula.textContent = `P(A|B) = P(A ∩ B) / P(B) = ${jointProba} / ${bProba} = ${roundToDecimal(conditionalProba)}`;
            addStepsToResult(resultSteps, steps);
            
            showResult('proba-conditional-result');
        } catch (error) {
            resultValue.textContent = `Erreur: ${error.message}`;
            resultFormula.textContent = "";
            resultSteps.innerHTML = "";
            showResult('proba-conditional-result');
        }
    });
    
    conditionalForm.addEventListener('reset', () => {
        showResult('proba-conditional-result', true);
    });
}

// Fonctions pour les calculs géométriques
function initGeometrie() {
    // Cercle
    const cercleForm = document.getElementById('cercle-form');
    cercleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const rayon = parseFloat(document.getElementById('cercle-rayon').value);
        
        const resultElement = document.getElementById('cercle-result');
        const resultAire = resultElement.querySelector('.result-aire');
        const resultPerimetre = resultElement.querySelector('.result-perimetre');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (rayon <= 0) {
                throw new Error("Le rayon doit être strictement positif");
            }
            
            const aire = Math.PI * rayon * rayon;
            const perimetre = 2 * Math.PI * rayon;
            let steps = [];
            
            steps.push(`Nous voulons calculer l'aire et le périmètre d'un cercle de rayon ${rayon} unités.`);
            steps.push(`Rappel : L'aire d'un cercle est donnée par A = π × r² et le périmètre par P = 2π × r`);
            
            steps.push(`Calcul de l'aire :`);
            steps.push(`Étape 1 : Calculons le carré du rayon.`);
            steps.push(`r² = ${rayon} × ${rayon} = ${rayon * rayon}`);
            steps.push(`Étape 2 : Multiplions par π.`);
            steps.push(`A = π × r² = π × ${rayon * rayon} = ${roundToDecimal(aire)} unités²`);
            
            steps.push(`Calcul du périmètre :`);
            steps.push(`Étape 1 : Multiplions le rayon par 2π.`);
            steps.push(`P = 2π × r = 2π × ${rayon} = ${roundToDecimal(perimetre)} unités`);
            
            resultAire.textContent = `Aire: ${roundToDecimal(aire)} unités²`;
            resultPerimetre.textContent = `Périmètre: ${roundToDecimal(perimetre)} unités`;
            addStepsToResult(resultSteps, steps);
            
            showResult('cercle-result');
        } catch (error) {
            resultAire.textContent = `Erreur: ${error.message}`;
            resultPerimetre.textContent = "";
            resultSteps.innerHTML = "";
            showResult('cercle-result');
        }
    });
    
    cercleForm.addEventListener('reset', () => {
        showResult('cercle-result', true);
    });
    
    // Rectangle
    const rectangleForm = document.getElementById('rectangle-form');
    rectangleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const longueur = parseFloat(document.getElementById('rectangle-longueur').value);
        const largeur = parseFloat(document.getElementById('rectangle-largeur').value);
        
        const resultElement = document.getElementById('rectangle-result');
        const resultAire = resultElement.querySelector('.result-aire');
        const resultPerimetre = resultElement.querySelector('.result-perimetre');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (longueur <= 0 || largeur <= 0) {
                throw new Error("Les dimensions doivent être strictement positives");
            }
            
            const aire = longueur * largeur;
            const perimetre = 2 * (longueur + largeur);
            let steps = [];
            
            steps.push(`Nous voulons calculer l'aire et le périmètre d'un rectangle de longueur ${longueur} unités et de largeur ${largeur} unités.`);
            steps.push(`Rappel : L'aire d'un rectangle est donnée par A = longueur × largeur et le périmètre par P = 2 × (longueur + largeur)`);
            
            steps.push(`Calcul de l'aire :`);
            steps.push(`Étape 1 : Multiplions la longueur par la largeur.`);
            steps.push(`A = longueur × largeur = ${longueur} × ${largeur} = ${aire} unités²`);
            
            steps.push(`Calcul du périmètre :`);
            steps.push(`Étape 1 : Additionnons la longueur et la largeur.`);
            steps.push(`longueur + largeur = ${longueur} + ${largeur} = ${longueur + largeur}`);
            steps.push(`Étape 2 : Multiplions par 2.`);
            steps.push(`P = 2 × (longueur + largeur) = 2 × ${longueur + largeur} = ${perimetre} unités`);
            
            resultAire.textContent = `Aire: ${roundToDecimal(aire)} unités²`;
            resultPerimetre.textContent = `Périmètre: ${roundToDecimal(perimetre)} unités`;
            addStepsToResult(resultSteps, steps);
            
            showResult('rectangle-result');
        } catch (error) {
            resultAire.textContent = `Erreur: ${error.message}`;
            resultPerimetre.textContent = "";
            resultSteps.innerHTML = "";
            showResult('rectangle-result');
        }
    });
    
    rectangleForm.addEventListener('reset', () => {
        showResult('rectangle-result', true);
    });
    
    // Triangle
    const triangleForm = document.getElementById('triangle-form');
    triangleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const base = parseFloat(document.getElementById('triangle-base').value);
        const hauteur = parseFloat(document.getElementById('triangle-hauteur').value);
        
        const resultElement = document.getElementById('triangle-result');
        const resultAire = resultElement.querySelector('.result-aire');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (base <= 0 || hauteur <= 0) {
                throw new Error("Les dimensions doivent être strictement positives");
            }
            
            const aire = (base * hauteur) / 2;
            let steps = [];
            
            steps.push(`Nous voulons calculer l'aire d'un triangle de base ${base} unités et de hauteur ${hauteur} unités.`);
            steps.push(`Rappel : L'aire d'un triangle est donnée par A = (base × hauteur) / 2`);
            
            steps.push(`Étape 1 : Multiplions la base par la hauteur.`);
            steps.push(`base × hauteur = ${base} × ${hauteur} = ${base * hauteur}`);
            steps.push(`Étape 2 : Divisons par 2.`);
            steps.push(`A = (base × hauteur) / 2 = ${base * hauteur} / 2 = ${aire} unités²`);
            
            resultAire.textContent = `Aire: ${roundToDecimal(aire)} unités²`;
            addStepsToResult(resultSteps, steps);
            
            showResult('triangle-result');
        } catch (error) {
            resultAire.textContent = `Erreur: ${error.message}`;
            resultSteps.innerHTML = "";
            showResult('triangle-result');
        }
    });
    
    triangleForm.addEventListener('reset', () => {
        showResult('triangle-result', true);
    });
    
    // Trapèze
    const trapezeForm = document.getElementById('trapeze-form');
    trapezeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const petiteBase = parseFloat(document.getElementById('trapeze-petite-base').value);
        const grandeBase = parseFloat(document.getElementById('trapeze-grande-base').value);
        const hauteur = parseFloat(document.getElementById('trapeze-hauteur').value);
        
        const resultElement = document.getElementById('trapeze-result');
        const resultAire = resultElement.querySelector('.result-aire');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (petiteBase <= 0 || grandeBase <= 0 || hauteur <= 0) {
                throw new Error("Les dimensions doivent être strictement positives");
            }
            
            const aire = ((petiteBase + grandeBase) * hauteur) / 2;
            let steps = [];
            
            steps.push(`Nous voulons calculer l'aire d'un trapèze de petite base ${petiteBase} unités, de grande base ${grandeBase} unités et de hauteur ${hauteur} unités.`);
            steps.push(`Rappel : L'aire d'un trapèze est donnée par A = ((a + c) × h) / 2, où a et c sont les longueurs des bases et h est la hauteur.`);
            
            steps.push(`Étape 1 : Additionnons les bases.`);
            steps.push(`a + c = ${petiteBase} + ${grandeBase} = ${petiteBase + grandeBase}`);
            steps.push(`Étape 2 : Multiplions par la hauteur.`);
            steps.push(`(a + c) × h = ${petiteBase + grandeBase} × ${hauteur} = ${(petiteBase + grandeBase) * hauteur}`);
            steps.push(`Étape 3 : Divisons par 2.`);
            steps.push(`A = ((a + c) × h) / 2 = ${(petiteBase + grandeBase) * hauteur} / 2 = ${aire} unités²`);
            
            resultAire.textContent = `Aire: ${roundToDecimal(aire)} unités²`;
            addStepsToResult(resultSteps, steps);
            
            showResult('trapeze-result');
        } catch (error) {
            resultAire.textContent = `Erreur: ${error.message}`;
            resultSteps.innerHTML = "";
            showResult('trapeze-result');
        }
    });
    
    trapezeForm.addEventListener('reset', () => {
        showResult('trapeze-result', true);
    });
    
    // Parallélogramme
    const parallelogrammeForm = document.getElementById('parallelogramme-form');
    parallelogrammeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const base = parseFloat(document.getElementById('parallelogramme-base').value);
        const hauteur = parseFloat(document.getElementById('parallelogramme-hauteur').value);
        
        const resultElement = document.getElementById('parallelogramme-result');
        const resultAire = resultElement.querySelector('.result-aire');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (base <= 0 || hauteur <= 0) {
                throw new Error("Les dimensions doivent être strictement positives");
            }
            
            const aire = base * hauteur;
            let steps = [];
            
            steps.push(`Nous voulons calculer l'aire d'un parallélogramme de base ${base} unités et de hauteur ${hauteur} unités.`);
            steps.push(`Rappel : L'aire d'un parallélogramme est donnée par A = base × hauteur`);
            
            steps.push(`Étape 1 : Multiplions la base par la hauteur.`);
            steps.push(`A = base × hauteur = ${base} × ${hauteur} = ${aire} unités²`);
            
            resultAire.textContent = `Aire: ${roundToDecimal(aire)} unités²`;
            addStepsToResult(resultSteps, steps);
            
            showResult('parallelogramme-result');
        } catch (error) {
            resultAire.textContent = `Erreur: ${error.message}`;
            resultSteps.innerHTML = "";
            showResult('parallelogramme-result');
        }
    });
    
    parallelogrammeForm.addEventListener('reset', () => {
        showResult('parallelogramme-result', true);
    });
    
    // Cylindre
    const cylindreForm = document.getElementById('cylindre-form');
    cylindreForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const rayon = parseFloat(document.getElementById('cylindre-rayon').value);
        const hauteur = parseFloat(document.getElementById('cylindre-hauteur').value);
        
        const resultElement = document.getElementById('cylindre-result');
        const resultVolume = resultElement.querySelector('.result-volume');
        const resultSurface = resultElement.querySelector('.result-surface');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (rayon <= 0 || hauteur <= 0) {
                throw new Error("Les dimensions doivent être strictement positives");
            }
            
            const volume = Math.PI * rayon * rayon * hauteur;
            const surface = 2 * Math.PI * rayon * (rayon + hauteur);
            let steps = [];
            
            steps.push(`Nous voulons calculer le volume et la surface d'un cylindre de rayon ${rayon} unités et de hauteur ${hauteur} unités.`);
            steps.push(`Rappel : Le volume d'un cylindre est donné par V = π × r² × h et la surface totale par S = 2π × r × (r + h)`);
            
            steps.push(`Calcul du volume :`);
            steps.push(`Étape 1 : Calculons le carré du rayon.`);
            steps.push(`r² = ${rayon} × ${rayon} = ${rayon * rayon}`);
            steps.push(`Étape 2 : Multiplions par π et par la hauteur.`);
            steps.push(`V = π × r² × h = π × ${rayon * rayon} × ${hauteur} = ${roundToDecimal(volume)} unités³`);
            
            steps.push(`Calcul de la surface totale :`);
            steps.push(`Étape 1 : Additionnons le rayon et la hauteur.`);
            steps.push(`r + h = ${rayon} + ${hauteur} = ${rayon + hauteur}`);
            steps.push(`Étape 2 : Multiplions par 2π et par le rayon.`);
            steps.push(`S = 2π × r × (r + h) = 2π × ${rayon} × ${rayon + hauteur} = ${roundToDecimal(surface)} unités²`);
            
            resultVolume.textContent = `Volume: ${roundToDecimal(volume)} unités³`;
            resultSurface.textContent = `Surface totale: ${roundToDecimal(surface)} unités²`;
            addStepsToResult(resultSteps, steps);
            
            showResult('cylindre-result');
        } catch (error) {
            resultVolume.textContent = `Erreur: ${error.message}`;
            resultSurface.textContent = "";
            resultSteps.innerHTML = "";
            showResult('cylindre-result');
        }
    });
    
    cylindreForm.addEventListener('reset', () => {
        showResult('cylindre-result', true);
    });
    
    // Sphère
    const sphereForm = document.getElementById('sphere-form');
    sphereForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const rayon = parseFloat(document.getElementById('sphere-rayon').value);
        
        const resultElement = document.getElementById('sphere-result');
        const resultVolume = resultElement.querySelector('.result-volume');
        const resultSurface = resultElement.querySelector('.result-surface');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (rayon <= 0) {
                throw new Error("Le rayon doit être strictement positif");
            }
            
            const volume = (4/3) * Math.PI * rayon * rayon * rayon;
            const surface = 4 * Math.PI * rayon * rayon;
            let steps = [];
            
            steps.push(`Nous voulons calculer le volume et la surface d'une sphère de rayon ${rayon} unités.`);
            steps.push(`Rappel : Le volume d'une sphère est donné par V = (4/3) × π × r³ et la surface par S = 4π × r²`);
            
            steps.push(`Calcul du volume :`);
            steps.push(`Étape 1 : Calculons le cube du rayon.`);
            steps.push(`r³ = ${rayon} × ${rayon} × ${rayon} = ${rayon * rayon * rayon}`);
            steps.push(`Étape 2 : Multiplions par (4/3) × π.`);
            steps.push(`V = (4/3) × π × r³ = (4/3) × π × ${rayon * rayon * rayon} = ${roundToDecimal(volume)} unités³`);
            
            steps.push(`Calcul de la surface :`);
            steps.push(`Étape 1 : Calculons le carré du rayon.`);
            steps.push(`r² = ${rayon} × ${rayon} = ${rayon * rayon}`);
            steps.push(`Étape 2 : Multiplions par 4π.`);
            steps.push(`S = 4π × r² = 4π × ${rayon * rayon} = ${roundToDecimal(surface)} unités²`);
            
            resultVolume.textContent = `Volume: ${roundToDecimal(volume)} unités³`;
            resultSurface.textContent = `Surface: ${roundToDecimal(surface)} unités²`;
            addStepsToResult(resultSteps, steps);
            
            showResult('sphere-result');
        } catch (error) {
            resultVolume.textContent = `Erreur: ${error.message}`;
            resultSurface.textContent = "";
            resultSteps.innerHTML = "";
            showResult('sphere-result');
        }
    });
    
    sphereForm.addEventListener('reset', () => {
        showResult('sphere-result', true);
    });
    
    // Cône
    const coneForm = document.getElementById('cone-form');
    coneForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const rayon = parseFloat(document.getElementById('cone-rayon').value);
        const hauteur = parseFloat(document.getElementById('cone-hauteur').value);
        
        const resultElement = document.getElementById('cone-result');
        const resultVolume = resultElement.querySelector('.result-volume');
        const resultSurface = resultElement.querySelector('.result-surface');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (rayon <= 0 || hauteur <= 0) {
                throw new Error("Les dimensions doivent être strictement positives");
            }
            
            const volume = (1/3) * Math.PI * rayon * rayon * hauteur;
            const generatrice = Math.sqrt(rayon * rayon + hauteur * hauteur);
            const surface = Math.PI * rayon * (rayon + generatrice);
            let steps = [];
            
            steps.push(`Nous voulons calculer le volume et la surface d'un cône de rayon ${rayon} unités et de hauteur ${hauteur} unités.`);
            steps.push(`Rappel : Le volume d'un cône est donné par V = (1/3) × π × r² × h et la surface totale par S = π × r × (r + g) où g est la génératrice`);
            
            steps.push(`Calcul du volume :`);
            steps.push(`Étape 1 : Calculons le carré du rayon.`);
            steps.push(`r² = ${rayon} × ${rayon} = ${rayon * rayon}`);
            steps.push(`Étape 2 : Multiplions par (1/3) × π × h.`);
            steps.push(`V = (1/3) × π × r² × h = (1/3) × π × ${rayon * rayon} × ${hauteur} = ${roundToDecimal(volume)} unités³`);
            
            steps.push(`Calcul de la surface totale :`);
            steps.push(`Étape 1 : Calculons la génératrice (longueur de l'arête latérale).`);
            steps.push(`g = √(r² + h²) = √(${rayon * rayon} + ${hauteur * hauteur}) = ${roundToDecimal(generatrice)}`);
            steps.push(`Étape 2 : Calculons la surface totale.`);
            steps.push(`S = π × r × (r + g) = π × ${rayon} × (${rayon} + ${roundToDecimal(generatrice)}) = ${roundToDecimal(surface)} unités²`);
            
            resultVolume.textContent = `Volume: ${roundToDecimal(volume)} unités³`;
            resultSurface.textContent = `Surface totale: ${roundToDecimal(surface)} unités²`;
            addStepsToResult(resultSteps, steps);
            
            showResult('cone-result');
        } catch (error) {
            resultVolume.textContent = `Erreur: ${error.message}`;
            resultSurface.textContent = "";
            resultSteps.innerHTML = "";
            showResult('cone-result');
        }
    });
    
    coneForm.addEventListener('reset', () => {
        showResult('cone-result', true);
    });
    
    // Cube
    const cubeForm = document.getElementById('cube-form');
    cubeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cote = parseFloat(document.getElementById('cube-cote').value);
        
        const resultElement = document.getElementById('cube-result');
        const resultVolume = resultElement.querySelector('.result-volume');
        const resultSurface = resultElement.querySelector('.result-surface');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (cote <= 0) {
                throw new Error("La longueur du côté doit être strictement positive");
            }
            
            const volume = cote * cote * cote;
            const surface = 6 * cote * cote;
            let steps = [];
            
            steps.push(`Nous voulons calculer le volume et la surface d'un cube de côté ${cote} unités.`);
            steps.push(`Rappel : Le volume d'un cube est donné par V = a³ et la surface totale par S = 6 × a²`);
            
            steps.push(`Calcul du volume :`);
            steps.push(`Étape 1 : Calculons le cube du côté.`);
            steps.push(`V = a³ = ${cote} × ${cote} × ${cote} = ${volume} unités³`);
            
            steps.push(`Calcul de la surface totale :`);
            steps.push(`Étape 1 : Calculons le carré du côté.`);
            steps.push(`a² = ${cote} × ${cote} = ${cote * cote}`);
            steps.push(`Étape 2 : Multiplions par 6 (nombre de faces).`);
            steps.push(`S = 6 × a² = 6 × ${cote * cote} = ${surface} unités²`);
            
            resultVolume.textContent = `Volume: ${roundToDecimal(volume)} unités³`;
            resultSurface.textContent = `Surface totale: ${roundToDecimal(surface)} unités²`;
            addStepsToResult(resultSteps, steps);
            
            showResult('cube-result');
        } catch (error) {
            resultVolume.textContent = `Erreur: ${error.message}`;
            resultSurface.textContent = "";
            resultSteps.innerHTML = "";
            showResult('cube-result');
        }
    });
    
    cubeForm.addEventListener('reset', () => {
        showResult('cube-result', true);
    });
    
    // Prisme
    const prismeForm = document.getElementById('prisme-form');
    prismeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const aireBase = parseFloat(document.getElementById('prisme-base').value);
        const hauteur = parseFloat(document.getElementById('prisme-hauteur').value);
        const perimetreBase = parseFloat(document.getElementById('prisme-perimetre').value);
        
        const resultElement = document.getElementById('prisme-result');
        const resultVolume = resultElement.querySelector('.result-volume');
        const resultSurface = resultElement.querySelector('.result-surface');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (aireBase <= 0 || hauteur <= 0 || perimetreBase <= 0) {
                throw new Error("Les dimensions doivent être strictement positives");
            }
            
            const volume = aireBase * hauteur;
            const surface = 2 * aireBase + perimetreBase * hauteur;
            let steps = [];
            
            steps.push(`Nous voulons calculer le volume et la surface d'un prisme droit.`);
            steps.push(`Données : Aire de la base = ${aireBase} unités², Hauteur = ${hauteur} unités, Périmètre de la base = ${perimetreBase} unités`);
            steps.push(`Rappel : Le volume d'un prisme est donné par V = Aire de la base × h et la surface totale par S = 2 × Aire de la base + Périmètre de la base × h`);
            
            steps.push(`Calcul du volume :`);
            steps.push(`V = Aire de la base × h = ${aireBase} × ${hauteur} = ${volume} unités³`);
            
            steps.push(`Calcul de la surface totale :`);
            steps.push(`S = 2 × Aire de la base + Périmètre de la base × h`);
            steps.push(`S = 2 × ${aireBase} + ${perimetreBase} × ${hauteur}`);
            steps.push(`S = ${2 * aireBase} + ${perimetreBase * hauteur} = ${surface} unités²`);
            
            resultVolume.textContent = `Volume: ${roundToDecimal(volume)} unités³`;
            resultSurface.textContent = `Surface totale: ${roundToDecimal(surface)} unités²`;
            addStepsToResult(resultSteps, steps);
            
            showResult('prisme-result');
        } catch (error) {
            resultVolume.textContent = `Erreur: ${error.message}`;
            resultSurface.textContent = "";
            resultSteps.innerHTML = "";
            showResult('prisme-result');
        }
    });
    
    prismeForm.addEventListener('reset', () => {
        showResult('prisme-result', true);
    });
}

// Fonctions pour les conversions d'unités
function initConversions() {
    // Tables de conversion pour chaque type d'unité
    const longueurConversions = {
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        in: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.344
    };
    
    const masseConversions = {
        mg: 0.000001,
        g: 0.001,
        kg: 1,
        t: 1000,
        oz: 0.0283495,
        lb: 0.453592
    };
    
    const volumeConversions = {
        ml: 0.000001,
        cl: 0.00001,
        dl: 0.0001,
        l: 0.001,
        m3: 1,
        in3: 0.0000163871,
        ft3: 0.0283168,
        gal: 0.00378541
    };
    
    const surfaceConversions = {
        mm2: 0.000001,
        cm2: 0.0001,
        m2: 1,
        a: 100,
        ha: 10000,
        km2: 1000000,
        in2: 0.00064516,
        ft2: 0.092903,
        ac: 4046.86
    };
    
    // Fonction générique pour les conversions
    function convertUnit(value, fromUnit, toUnit, conversionTable, resultElementId) {
        const resultElement = document.getElementById(resultElementId);
        const resultValue = resultElement.querySelector('.result-value');
        const resultSteps = resultElement.querySelector('.result-steps');
        
        try {
            if (value <= 0 && resultElementId !== 'temperature-result') {
                throw new Error("La valeur doit être strictement positive");
            }
            
            let result, steps = [];
            
            if (resultElementId === 'temperature-result') {
                // Conversions spéciales pour les températures
                if (fromUnit === 'c' && toUnit === 'f') {
                    result = (value * 9/5) + 32;
                    steps.push(`Pour convertir de Celsius (°C) en Fahrenheit (°F), on utilise la formule : °F = (°C × 9/5) + 32`);
                    steps.push(`°F = (${value} × 9/5) + 32 = ${value * 9/5} + 32 = ${result}`);
                } else if (fromUnit === 'f' && toUnit === 'c') {
                    result = (value - 32) * 5/9;
                    steps.push(`Pour convertir de Fahrenheit (°F) en Celsius (°C), on utilise la formule : °C = (°F - 32) × 5/9`);
                    steps.push(`°C = (${value} - 32) × 5/9 = ${value - 32} × 5/9 = ${result}`);
                } else if (fromUnit === 'c' && toUnit === 'k') {
                    result = value + 273.15;
                    steps.push(`Pour convertir de Celsius (°C) en Kelvin (K), on utilise la formule : K = °C + 273.15`);
                    steps.push(`K = ${value} + 273.15 = ${result}`);
                } else if (fromUnit === 'k' && toUnit === 'c') {
                    result = value - 273.15;
                    steps.push(`Pour convertir de Kelvin (K) en Celsius (°C), on utilise la formule : °C = K - 273.15`);
                    steps.push(`°C = ${value} - 273.15 = ${result}`);
                } else if (fromUnit === 'f' && toUnit === 'k') {
                    result = (value - 32) * 5/9 + 273.15;
                    steps.push(`Pour convertir de Fahrenheit (°F) en Kelvin (K), on utilise la formule : K = (°F - 32) × 5/9 + 273.15`);
                    steps.push(`K = (${value} - 32) × 5/9 + 273.15 = ${(value - 32) * 5/9} + 273.15 = ${result}`);
                } else if (fromUnit === 'k' && toUnit === 'f') {
                    result = (value - 273.15) * 9/5 + 32;
                    steps.push(`Pour convertir de Kelvin (K) en Fahrenheit (°F), on utilise la formule : °F = (K - 273.15) × 9/5 + 32`);
                    steps.push(`°F = (${value} - 273.15) × 9/5 + 32 = ${(value - 273.15) * 9/5} + 32 = ${result}`);
                } else if (fromUnit === toUnit) {
                    result = value;
                    steps.push(`Même unité, aucune conversion nécessaire.`);
                    steps.push(`${value} ${fromUnit} = ${result} ${toUnit}`);
                }
            } else if (resultElementId === 'temps-result') {
                // Conversions pour le temps (approximations pour mois et années)
                const tempsConversions = {
                    ms: 0.001,
                    s: 1,
                    min: 60,
                    h: 3600,
                    j: 86400,
                    sem: 604800,
                    mois: 2592000, // 30 jours approximativement
                    an: 31536000 // 365 jours approximativement
                };
                
                // Convertir en unité de base (seconde)
                const valueInBaseUnit = value * tempsConversions[fromUnit];
                
                // Convertir de l'unité de base à l'unité cible
                result = valueInBaseUnit / tempsConversions[toUnit];
                
                steps.push(`Étape 1 : Convertir ${value} ${getUnitFullName(fromUnit)} en secondes.`);
                steps.push(`${value} ${getUnitFullName(fromUnit)} = ${value} × ${tempsConversions[fromUnit]} = ${valueInBaseUnit} secondes`);
                
                steps.push(`Étape 2 : Convertir ${valueInBaseUnit} secondes en ${getUnitFullName(toUnit)}.`);
                steps.push(`${valueInBaseUnit} secondes = ${valueInBaseUnit} / ${tempsConversions[toUnit]} = ${result} ${getUnitFullName(toUnit)}`);
            } else {
                // Autres conversions standards
                const conversionTable = resultElementId === 'longueur-result' ? longueurConversions :
                                      resultElementId === 'masse-result' ? masseConversions :
                                      resultElementId === 'volume-result' ? volumeConversions :
                                      surfaceConversions;
                
                // Convertir en unité de base (mètre, kilogramme, mètre cube ou mètre carré)
                const valueInBaseUnit = value * conversionTable[fromUnit];
                
                // Convertir de l'unité de base à l'unité cible
                result = valueInBaseUnit / conversionTable[toUnit];
                
                steps.push(`Étape 1 : Convertir ${value} ${getUnitFullName(fromUnit)} en unité de base.`);
                steps.push(`${value} ${getUnitFullName(fromUnit)} = ${value} × ${conversionTable[fromUnit]} = ${valueInBaseUnit} ${getBaseUnit(resultElementId)}`);
                
                steps.push(`Étape 2 : Convertir ${valueInBaseUnit} ${getBaseUnit(resultElementId)} en ${getUnitFullName(toUnit)}.`);
                steps.push(`${valueInBaseUnit} ${getBaseUnit(resultElementId)} = ${valueInBaseUnit} / ${conversionTable[toUnit]} = ${result} ${getUnitFullName(toUnit)}`);
            }
            
            resultValue.textContent = `${value} ${getUnitFullName(fromUnit)} = ${roundToDecimal(result)} ${getUnitFullName(toUnit)}`;
            addStepsToResult(resultSteps, steps);
            
            showResult(resultElementId);
        } catch (error) {
            resultValue.textContent = `Erreur: ${error.message}`;
            resultSteps.innerHTML = "";
            showResult(resultElementId);
        }
    }
    
    // Fonction pour obtenir le nom complet d'une unité
    function getUnitFullName(unit) {
        const unitNames = {
            // Longueur
            mm: 'millimètres (mm)',
            cm: 'centimètres (cm)',
            m: 'mètres (m)',
            km: 'kilomètres (km)',
            in: 'pouces (in)',
            ft: 'pieds (ft)',
            yd: 'yards (yd)',
            mi: 'miles (mi)',
            // Masse
            mg: 'milligrammes (mg)',
            g: 'grammes (g)',
            kg: 'kilogrammes (kg)',
            t: 'tonnes (t)',
            oz: 'onces (oz)',
            lb: 'livres (lb)',
            // Volume
            ml: 'millilitres (ml)',
            cl: 'centilitres (cl)',
            dl: 'décilitres (dl)',
            l: 'litres (l)',
            m3: 'mètres cubes (m³)',
            in3: 'pouces cubes (in³)',
            ft3: 'pieds cubes (ft³)',
            gal: 'gallons US (gal)',
            // Surface
            mm2: 'millimètres carrés (mm²)',
            cm2: 'centimètres carrés (cm²)',
            m2: 'mètres carrés (m²)',
            a: 'ares (a)',
            ha: 'hectares (ha)',
            km2: 'kilomètres carrés (km²)',
            in2: 'pouces carrés (in²)',
            ft2: 'pieds carrés (ft²)',
            ac: 'acres (ac)',
            // Température
            c: 'degrés Celsius (°C)',
            f: 'degrés Fahrenheit (°F)',
            k: 'Kelvin (K)',
            // Temps
            ms: 'millisecondes (ms)',
            s: 'secondes (s)',
            min: 'minutes (min)',
            h: 'heures (h)',
            j: 'jours (j)',
            sem: 'semaines (sem)',
            mois: 'mois',
            an: 'années (an)'
        };
        
        return unitNames[unit] || unit;
    }
    
    // Fonction pour obtenir l'unité de base
    function getBaseUnit(resultElementId) {
        switch (resultElementId) {
            case 'longueur-result':
                return 'mètres (m)';
            case 'masse-result':
                return 'kilogrammes (kg)';
            case 'volume-result':
                return 'mètres cubes (m³)';
            case 'surface-result':
                return 'mètres carrés (m²)';
            case 'temps-result':
                return 'secondes (s)';
            default:
                return '';
        }
    }
    
    // Initialisation des formulaires de conversion
    const formIds = ['longueur', 'masse', 'volume', 'surface', 'temperature', 'temps'];
    
    formIds.forEach(id => {
        const form = document.getElementById(`${id}-form`);
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const value = parseFloat(document.getElementById(`${id}-valeur`).value);
            const fromUnit = document.getElementById(`${id}-de`).value;
            const toUnit = document.getElementById(`${id}-vers`).value;
            
            convertUnit(value, fromUnit, toUnit, null, `${id}-result`);
        });
        
        form.addEventListener('reset', () => {
            showResult(`${id}-result`, true);
        });
    });
}

// Fonctions de partage
function initShareButtons() {
    const copyLinkBtn = document.getElementById('copy-link');
    copyLinkBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                showNotification('Le lien a été copié !');
            })
            .catch(err => {
                showNotification('Erreur lors de la copie du lien');
                console.error('Erreur lors de la copie: ', err);
            });
    });
    
    const shareFacebook = document.getElementById('share-facebook');
    shareFacebook.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, 
            'facebook-share-dialog', 
            'width=800,height=600');
    });
    
    const shareTwitter = document.getElementById('share-twitter');
    shareTwitter.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Découvrez MathSolver, une application pour résoudre vos problèmes mathématiques !')}`, 
            'twitter-share-dialog', 
            'width=800,height=600');
    });
}

// Sidebar navigation
function initSidebar() {
    const sidebarSections = document.querySelectorAll('.sidebar-section-title');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    // Toggle sidebar sections
    sidebarSections.forEach(section => {
        section.addEventListener('click', () => {
            const parent = section.parentElement;
            parent.classList.toggle('open');
        });
    });
    
    // Mobile sidebar toggle
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// Modal functions
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalClose = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal with button
    modalClose.forEach(close => {
        close.addEventListener('click', () => {
            const modal = close.closest('.modal-overlay');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close modal by clicking overlay
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Solution toggles for exercises
    const solutionToggles = document.querySelectorAll('.solution-toggle');
    solutionToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const solution = toggle.nextElementSibling;
            if (solution.style.display === 'block') {
                solution.style.display = 'none';
                toggle.textContent = 'Afficher la solution';
            } else {
                solution.style.display = 'block';
                toggle.textContent = 'Masquer la solution';
            }
        });
    });
    
    // Modal navigation buttons
    const modalNavButtons = document.querySelectorAll('.modal-prev, .modal-next');
    modalNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentModal = button.closest('.modal-overlay');
            const currentModalId = currentModal.id;
            const isNext = button.classList.contains('modal-next');
            
            // Get all modal IDs based on the current type (lesson, example, exercise)
            const modalType = currentModalId.split('-').pop(); // Gets "lesson", "example", or "exercise"
            const allModalsOfType = Array.from(document.querySelectorAll(`.modal-overlay[id$="-${modalType}"]`));
            const currentIndex = allModalsOfType.findIndex(modal => modal.id === currentModalId);
            
            // Calculate next or previous index (with wraparound)
            const newIndex = isNext ? 
                (currentIndex + 1) % allModalsOfType.length : 
                (currentIndex - 1 + allModalsOfType.length) % allModalsOfType.length;
            
            // Close current modal and open the next/previous one
            currentModal.classList.remove('active');
            allModalsOfType[newIndex].classList.add('active');
        });
    });
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTabs();
    initPythagore();
    initThales();
    initEquations();
    initProbabilites();
    initGeometrie();
    initConversions();
    initShareButtons();
    initSidebar();
    initModals();
});