// Global state
let selectedSymptoms = new Set();
let patientData = {};

// Show age verification modal on page load
document.addEventListener('DOMContentLoaded', function() {
    const modal = new bootstrap.Modal(document.getElementById('ageVerificationModal'));
    modal.show();
    loadDoctorList();
    loadSymptomsList();
    initializeSymptomSearch();
    updateProgressSteps(1);
});

// Age verification
function verifyAge() {
    const isChecked = document.getElementById('ageVerificationCheckbox').checked;
    
    if (isChecked) {
        bootstrap.Modal.getInstance(document.getElementById('ageVerificationModal')).hide();
        document.getElementById('patientForm').style.display = 'block';
    } else {
        showAlert('Age Verification', 'Please confirm that you are 18 years or older.', 'warning');
    }
}

// Navigation functions
function showHome() {
    hideAllSections();
    document.getElementById('homeSection').style.display = 'block';
}

function showAboutUs() {
    hideAllSections();
    document.getElementById('aboutUsSection').style.display = 'block';
}

function showContactDoctor() {
    hideAllSections();
    document.getElementById('contactDoctorSection').style.display = 'block';
    loadDoctorList();
}

function hideAllSections() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');
}

// Handle patient form submission
function handlePatientSubmit(event) {
    event.preventDefault();
    
    const dobDate = new Date(document.getElementById('dob').value);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
    }
    
    patientData = {
        name: document.getElementById('name').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        age: age,
        contact: document.getElementById('contact').value,
        address: document.getElementById('address').value
    };

    document.getElementById('patientForm').style.display = 'none';
    document.getElementById('symptomsSection').style.display = 'block';
    updateProgressSteps(2);
}

// Progress steps
function updateProgressSteps(step) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((s, index) => {
        if (index + 1 <= step) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

// Symptoms management
const symptoms = [
    // Respiratory Symptoms
    { id: 1, name: "Cough", category: "Respiratory", severity: "medium" },
    { id: 2, name: "Shortness of Breath", category: "Respiratory", severity: "severe" },
    { id: 3, name: "Wheezing", category: "Respiratory", severity: "medium" },
    { id: 4, name: "Chest Congestion", category: "Respiratory", severity: "medium" },
    { id: 5, name: "Rapid Breathing", category: "Respiratory", severity: "severe" },

    // General Symptoms
    { id: 6, name: "Fever", category: "General", severity: "medium" },
    { id: 7, name: "Fatigue", category: "General", severity: "medium" },
    { id: 8, name: "Weakness", category: "General", severity: "medium" },
    { id: 9, name: "Chills", category: "General", severity: "mild" },
    { id: 10, name: "Night Sweats", category: "General", severity: "medium" },

    // Gastrointestinal Symptoms
    { id: 11, name: "Nausea", category: "Gastrointestinal", severity: "medium" },
    { id: 12, name: "Vomiting", category: "Gastrointestinal", severity: "severe" },
    { id: 13, name: "Diarrhea", category: "Gastrointestinal", severity: "medium" },
    { id: 14, name: "Abdominal Pain", category: "Gastrointestinal", severity: "medium" },
    { id: 15, name: "Loss of Appetite", category: "Gastrointestinal", severity: "mild" },

    // Neurological Symptoms
    { id: 16, name: "Headache", category: "Neurological", severity: "medium" },
    { id: 17, name: "Dizziness", category: "Neurological", severity: "medium" },
    { id: 18, name: "Confusion", category: "Neurological", severity: "severe" },
    { id: 19, name: "Memory Problems", category: "Neurological", severity: "medium" },
    { id: 20, name: "Seizures", category: "Neurological", severity: "severe" },

    // Musculoskeletal Symptoms
    { id: 21, name: "Joint Pain", category: "Musculoskeletal", severity: "medium" },
    { id: 22, name: "Muscle Pain", category: "Musculoskeletal", severity: "medium" },
    { id: 23, name: "Back Pain", category: "Musculoskeletal", severity: "medium" },
    { id: 24, name: "Neck Pain", category: "Musculoskeletal", severity: "medium" },
    { id: 25, name: "Muscle Weakness", category: "Musculoskeletal", severity: "medium" },

    // Cardiovascular Symptoms
    { id: 26, name: "Chest Pain", category: "Cardiovascular", severity: "severe" },
    { id: 27, name: "Palpitations", category: "Cardiovascular", severity: "medium" },
    { id: 28, name: "High Blood Pressure", category: "Cardiovascular", severity: "severe" },
    { id: 29, name: "Irregular Heartbeat", category: "Cardiovascular", severity: "severe" },
    { id: 30, name: "Swelling in Legs", category: "Cardiovascular", severity: "medium" },

    // Skin Symptoms
    { id: 31, name: "Rash", category: "Skin", severity: "mild" },
    { id: 32, name: "Itching", category: "Skin", severity: "mild" },
    { id: 33, name: "Hives", category: "Skin", severity: "medium" },
    { id: 34, name: "Skin Dryness", category: "Skin", severity: "mild" },
    { id: 35, name: "Skin Discoloration", category: "Skin", severity: "mild" },

    // ENT Symptoms
    { id: 36, name: "Sore Throat", category: "ENT", severity: "mild" },
    { id: 37, name: "Runny Nose", category: "ENT", severity: "mild" },
    { id: 38, name: "Ear Pain", category: "ENT", severity: "medium" },
    { id: 39, name: "Loss of Taste/Smell", category: "ENT", severity: "medium" },
    { id: 40, name: "Sinus Pressure", category: "ENT", severity: "medium" },

    // Mental Health Symptoms
    { id: 41, name: "Anxiety", category: "Mental Health", severity: "medium" },
    { id: 42, name: "Depression", category: "Mental Health", severity: "severe" },
    { id: 43, name: "Insomnia", category: "Mental Health", severity: "medium" },
    { id: 44, name: "Mood Swings", category: "Mental Health", severity: "medium" },
    { id: 45, name: "Panic Attacks", category: "Mental Health", severity: "severe" },

    // Other Symptoms
    { id: 46, name: "Weight Loss", category: "Other", severity: "medium" },
    { id: 47, name: "Weight Gain", category: "Other", severity: "medium" },
    { id: 48, name: "Excessive Thirst", category: "Other", severity: "medium" },
    { id: 49, name: "Frequent Urination", category: "Other", severity: "medium" },
    { id: 50, name: "Vision Changes", category: "Other", severity: "medium" }
];

const medications = {
    // Respiratory Medications
    "Cough": {
        "18-44": ["Dextromethorphan (Robitussin)", "Guaifenesin (Mucinex)"],
        "45-64": ["Benzonatate", "Codeine-based cough suppressants"],
        "65+": ["Low-dose Dextromethorphan", "Herbal cough remedies"]
    },
    "Shortness of Breath": {
        "18-44": ["Albuterol inhaler", "Ipratropium inhaler"],
        "45-64": ["Combination inhalers", "Oral bronchodilators"],
        "65+": ["Nebulizer treatments", "Low-dose bronchodilators"]
    },
    "Wheezing": {
        "18-44": ["Albuterol", "Montelukast"],
        "45-64": ["Inhaled corticosteroids", "Combination therapy"],
        "65+": ["Low-dose corticosteroids", "Nebulizer treatments"]
    },

    // General Medications
    "Fever": {
        "18-44": ["Acetaminophen (Tylenol)", "Ibuprofen (Advil)"],
        "45-64": ["NSAIDs", "Acetaminophen"],
        "65+": ["Low-dose Acetaminophen", "Careful NSAID use"]
    },
    "Fatigue": {
        "18-44": ["Iron supplements", "Vitamin B12"],
        "45-64": ["Multivitamins", "CoQ10"],
        "65+": ["Gentle exercise", "Nutritional supplements"]
    },

    // Gastrointestinal Medications
    "Nausea": {
        "18-44": ["Ondansetron (Zofran)", "Promethazine"],
        "45-64": ["Metoclopramide", "Prochlorperazine"],
        "65+": ["Low-dose antiemetics", "Ginger supplements"]
    },
    "Diarrhea": {
        "18-44": ["Loperamide (Imodium)", "Bismuth subsalicylate"],
        "45-64": ["Diphenoxylate-atropine", "Probiotics"],
        "65+": ["Careful hydration", "Gentle antidiarrheals"]
    },

    // Neurological Medications
    "Headache": {
        "18-44": ["Sumatriptan", "Rizatriptan"],
        "45-64": ["Topiramate", "Beta blockers"],
        "65+": ["Low-dose pain relievers", "Non-pharmacological approaches"]
    },
    "Dizziness": {
        "18-44": ["Meclizine", "Dimenhydrinate"],
        "45-64": ["Scopolamine patches", "Vestibular therapy"],
        "65+": ["Low-dose antivertigo", "Balance training"]
    },

    // Musculoskeletal Medications
    "Joint Pain": {
        "18-44": ["Ibuprofen", "Naproxen"],
        "45-64": ["Celecoxib", "Topical NSAIDs"],
        "65+": ["Acetaminophen", "Physical therapy"]
    },
    "Muscle Pain": {
        "18-44": ["Cyclobenzaprine", "Methocarbamol"],
        "45-64": ["Baclofen", "Tizanidine"],
        "65+": ["Gentle muscle relaxants", "Topical treatments"]
    },

    // Cardiovascular Medications
    "High Blood Pressure": {
        "18-44": ["Lisinopril", "Amlodipine"],
        "45-64": ["Losartan", "Metoprolol"],
        "65+": ["Low-dose ACE inhibitors", "Calcium channel blockers"]
    },
    "Chest Pain": {
        "18-44": ["Nitroglycerin", "Aspirin"],
        "45-64": ["Beta blockers", "Long-acting nitrates"],
        "65+": ["Low-dose nitrates", "Careful monitoring"]
    },

    // Skin Medications
    "Rash": {
        "18-44": ["Hydrocortisone cream", "Antihistamine creams"],
        "45-64": ["Triamcinolone", "Oral antihistamines"],
        "65+": ["Gentle corticosteroids", "Moisturizers"]
    },
    "Itching": {
        "18-44": ["Diphenhydramine", "Loratadine"],
        "45-64": ["Cetirizine", "Fexofenadine"],
        "65+": ["Non-sedating antihistamines", "Topical treatments"]
    },

    // Mental Health Medications
    "Anxiety": {
        "18-44": ["Sertraline", "Buspirone"],
        "45-64": ["Escitalopram", "Venlafaxine"],
        "65+": ["Low-dose SSRIs", "Counseling-focused approach"]
    },
    "Depression": {
        "18-44": ["Fluoxetine", "Bupropion"],
        "45-64": ["Duloxetine", "Venlafaxine"],
        "65+": ["Geriatric-appropriate antidepressants", "Therapy"]
    },
    "Insomnia": {
        "18-44": ["Zolpidem", "Melatonin"],
        "45-64": ["Eszopiclone", "Sleep hygiene"],
        "65+": ["Low-dose sleep aids", "Natural approaches"]
    }
};

// Counseling recommendations based on symptoms
const counselingRecommendations = {
    "Mental Health": {
        type: "Mental Health Counseling",
        description: "Professional support for emotional and psychological well-being",
        frequency: "Weekly sessions",
        duration: "45-60 minutes"
    },
    "Cardiovascular": {
        type: "Lifestyle Counseling",
        description: "Guidance on heart-healthy lifestyle changes",
        frequency: "Bi-weekly sessions",
        duration: "30-45 minutes"
    },
    "Respiratory": {
        type: "Respiratory Therapy Counseling",
        description: "Breathing exercises and respiratory management techniques",
        frequency: "Weekly sessions",
        duration: "30-45 minutes"
    },
    "Gastrointestinal": {
        type: "Dietary Counseling",
        description: "Nutritional guidance and dietary modifications",
        frequency: "Monthly sessions",
        duration: "45-60 minutes"
    },
    "General": {
        type: "General Health Counseling",
        description: "Overall health and wellness guidance",
        frequency: "Monthly sessions",
        duration: "30-45 minutes"
    }
};

function getAgeGroup(age) {
    if (age < 45) return "18-44";
    if (age < 65) return "45-64";
    return "65+";
}

function loadSymptomsList() {
    const symptomsListDiv = document.getElementById('symptomsList');
    symptomsListDiv.innerHTML = ''; // Clear existing content
    
    // Group symptoms by category
    const groupedSymptoms = symptoms.reduce((acc, symptom) => {
        if (!acc[symptom.category]) {
            acc[symptom.category] = [];
        }
        acc[symptom.category].push(symptom);
        return acc;
    }, {});
    
    // Create HTML for each category
    Object.entries(groupedSymptoms).forEach(([category, categorySymptoms]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'col-12 mb-4';
        
        categoryDiv.innerHTML = `
            <h4 class="category-title">${category}</h4>
            <div class="row">
                ${categorySymptoms.map(symptom => `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="symptom-checkbox">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" 
                                    id="symptom${symptom.id}" 
                                    value="${symptom.name}"
                                    onchange="handleSymptomSelection(event)">
                                <label class="form-check-label" for="symptom${symptom.id}">
                                    ${symptom.name}
                                    ${getSeverityBadge(symptom.severity)}
                                </label>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        symptomsListDiv.appendChild(categoryDiv);
    });
}

function getSeverityBadge(severity) {
    const colors = {
        mild: 'info',
        medium: 'warning',
        severe: 'danger'
    };
    return `<span class="badge bg-${colors[severity]} ms-2">${severity}</span>`;
}

function handleSymptomSelection(event) {
    const symptom = event.target.value;
    if (event.target.checked) {
        selectedSymptoms.add(symptom);
    } else {
        selectedSymptoms.delete(symptom);
    }
    updateSelectedSymptomsList();
}

function updateSelectedSymptomsList() {
    const selectedSymptomsDiv = document.querySelector('.selected-symptoms');
    selectedSymptomsDiv.innerHTML = Array.from(selectedSymptoms).map(symptom => `
        <span class="badge bg-primary me-2 mb-2">
            ${symptom}
            <i class="fas fa-times ms-2" onclick="removeSymptom('${symptom}')" style="cursor: pointer;"></i>
        </span>
    `).join('');
}

function removeSymptom(symptom) {
    selectedSymptoms.delete(symptom);
    document.querySelector(`input[value="${symptom}"]`).checked = false;
    updateSelectedSymptomsList();
}

function initializeSymptomSearch() {
    const searchInput = document.getElementById('symptomSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.symptom-checkbox').forEach(checkbox => {
            const label = checkbox.querySelector('.form-check-label').textContent.toLowerCase();
            checkbox.closest('.col-md-6').style.display = 
                label.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

// Analyze symptoms and provide recommendations
function analyzeSymptoms() {
    if (selectedSymptoms.size === 0) {
        showAlert('No Symptoms', 'Please select at least one symptom.', 'warning');
        return;
    }

    // Hide symptoms section and show results
    document.getElementById('symptomsSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    // Show results
    showResults();
    
    // Update progress
    updateProgressSteps(3);
}

function showResults() {
    const ageGroup = getAgeGroup(patientData.age);
    
    let medicationsHtml = '';
    let counselingHtml = '';
    
    // Generate medications HTML
    selectedSymptoms.forEach(symptom => {
        if (medications[symptom]) {
            const meds = medications[symptom][ageGroup];
            medicationsHtml += `
                <div class="medication-group">
                    <h5 class="symptom-title">
                        <i class="fas fa-pills me-2"></i>
                        For ${symptom}:
                    </h5>
                    <ul class="list-group list-group-flush">
                        ${meds.map(med => `
                            <li class="list-group-item">
                                <i class="fas fa-capsules text-primary me-2"></i>
                                ${med}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
    });
    
    // Generate counseling HTML
    const symptomCategories = new Set(
        Array.from(selectedSymptoms).map(symptom => 
            symptoms.find(s => s.name === symptom)?.category
        )
    );
    
    symptomCategories.forEach(category => {
        if (counselingRecommendations[category]) {
            const counsel = counselingRecommendations[category];
            counselingHtml += `
                <div class="counseling-group">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="counseling-title">
                                <i class="fas fa-user-md me-2"></i>
                                ${counsel.type}
                            </h5>
                            <p>${counsel.description}</p>
                            <div class="text-muted">
                                <small>
                                    <i class="fas fa-clock me-1"></i>
                                    Frequency: ${counsel.frequency}
                                </small>
                                <br>
                                <small>
                                    <i class="fas fa-hourglass-half me-1"></i>
                                    Duration: ${counsel.duration}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    // Update the results section
    document.getElementById('analysisResults').innerHTML = `
        <div class="results-container">
            <div class="row">
                <!-- Medications Column -->
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-header bg-primary text-white">
                            <h4 class="mb-0">
                                <i class="fas fa-pills me-2"></i>
                                Recommended Medications
                                <small class="d-block mt-1">Age Group: ${ageGroup}</small>
                            </h4>
                        </div>
                        <div class="card-body">
                            ${medicationsHtml}
                        </div>
                    </div>
                </div>
                
                <!-- Counseling Column -->
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-header bg-success text-white">
                            <h4 class="mb-0">
                                <i class="fas fa-comments me-2"></i>
                                Counseling Recommendations
                            </h4>
                        </div>
                        <div class="card-body">
                            ${counselingHtml}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Prescription Section -->
            <div class="prescription-section mt-4">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h4 class="mb-0">
                            <i class="fas fa-file-medical me-2"></i>
                            Your Prescription
                        </h4>
                    </div>
                    <div class="card-body">
                        ${generatePrescription()}
                    </div>
                </div>
            </div>
            
            <!-- Print Button -->
            <div class="mt-4 text-center">
                <button onclick="printPrescription()" class="btn btn-primary btn-lg">
                    <i class="fas fa-print me-2"></i>Print Prescription
                </button>
            </div>
            
            <!-- Disclaimer -->
            <div class="alert alert-warning mt-4">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Important:</strong> This is an AI-generated assessment. Please consult a healthcare provider for proper diagnosis and treatment.
            </div>
        </div>
    `;
}

function calculateSeverityScore() {
    let score = 0;
    let count = 0;
    
    selectedSymptoms.forEach(symptom => {
        const symptomData = symptoms.find(s => s.name === symptom);
        if (symptomData) {
            switch (symptomData.severity) {
                case 'severe': score += 3; break;
                case 'medium': score += 2; break;
                case 'mild': score += 1; break;
            }
            count++;
        }
    });
    
    return Math.min(100, (score / (count * 3)) * 100);
}

function getSeverityClass(score) {
    if (score >= 75) return 'bg-danger';
    if (score >= 50) return 'bg-warning';
    return 'bg-success';
}

function getSeverityLevel(score) {
    if (score >= 75) return 'High';
    if (score >= 50) return 'Moderate';
    return 'Low';
}

function generateRecommendations() {
    let recommendations = '';
    const ageGroup = getAgeGroup(patientData.age);
    
    // Add general recommendations
    recommendations += `
        <li class="list-group-item">
            <i class="fas fa-user-md me-2 text-primary"></i>
            Based on your age group (${ageGroup}), we recommend:
            <ul class="mt-2">
                ${Array.from(selectedSymptoms).map(symptom => {
                    const meds = medications[symptom] ? medications[symptom][ageGroup] : null;
                    if (!meds) return '';
                    return `<li>For ${symptom}: ${meds.join(' or ')}</li>`;
                }).join('')}
            </ul>
        </li>
    `;

    // Add urgent case warning if needed
    if (isUrgentCase()) {
        recommendations += `
            <li class="list-group-item list-group-item-danger">
                <i class="fas fa-exclamation-circle me-2"></i>
                <strong>Urgent Medical Attention Required:</strong> Some of your symptoms indicate a need for immediate medical care.
                Please contact emergency services or visit the nearest emergency room.
            </li>
        `;
    }

    // Add counseling recommendations
    const symptomCategories = new Set(
        Array.from(selectedSymptoms).map(symptom => 
            symptoms.find(s => s.name === symptom)?.category
        )
    );

    symptomCategories.forEach(category => {
        if (counselingRecommendations[category]) {
            const counsel = counselingRecommendations[category];
            recommendations += `
                <li class="list-group-item">
                    <i class="fas fa-comments me-2 text-success"></i>
                    <strong>${counsel.type}:</strong> ${counsel.description}
                    <div class="mt-2 text-muted">
                        <small>
                            <i class="fas fa-clock me-1"></i> ${counsel.frequency} | 
                            <i class="fas fa-hourglass-half me-1"></i> ${counsel.duration}
                        </small>
                    </div>
                </li>
            `;
        }
    });

    return recommendations;
}

function generatePrescription() {
    const prescription = {
        patientInfo: patientData,
        date: new Date().toLocaleDateString(),
        symptoms: Array.from(selectedSymptoms),
        medications: [],
        counseling: [],
        recommendations: []
    };

    // Add medications based on symptoms
    const ageGroup = getAgeGroup(patientData.age);
    selectedSymptoms.forEach(symptom => {
        if (medications[symptom]) {
            prescription.medications.push({
                symptom: symptom,
                medications: medications[symptom][ageGroup]
            });
        }
    });

    // Add counseling recommendations
    const symptomCategories = new Set(
        Array.from(selectedSymptoms).map(symptom => 
            symptoms.find(s => s.name === symptom)?.category
        )
    );

    symptomCategories.forEach(category => {
        if (counselingRecommendations[category]) {
            prescription.counseling.push(counselingRecommendations[category]);
        }
    });

    // Generate HTML for prescription
    return `
        <div class="prescription-content">
            <div class="prescription-header">
                <h4>Medical Prescription</h4>
                <p>Date: ${prescription.date}</p>
            </div>
            
            <div class="patient-info mb-4">
                <p><strong>Patient:</strong> ${prescription.patientInfo.name}</p>
                <p><strong>Age:</strong> ${prescription.patientInfo.age}</p>
                <p><strong>Gender:</strong> ${prescription.patientInfo.gender}</p>
            </div>

            <div class="symptoms-list mb-4">
                <h5>Symptoms</h5>
                <ul>
                    ${prescription.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
                </ul>
            </div>

            <div class="medications-list mb-4">
                <h5>Prescribed Medications</h5>
                ${prescription.medications.map(med => `
                    <div class="medication-item">
                        <p><strong>For ${med.symptom}:</strong></p>
                        <ul>
                            ${med.medications.map(m => `<li>${m}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>

            <div class="counseling-recommendations mb-4">
                <h5>Counseling Recommendations</h5>
                ${prescription.counseling.map(counsel => `
                    <div class="counseling-item">
                        <p><strong>${counsel.type}</strong></p>
                        <p>${counsel.description}</p>
                        <p>Frequency: ${counsel.frequency}</p>
                        <p>Duration: ${counsel.duration}</p>
                    </div>
                `).join('')}
            </div>

            <div class="prescription-footer">
                <p><strong>Next Review:</strong> In 2 weeks</p>
                <p><strong>Emergency Contact:</strong> Call 911 for severe symptoms</p>
            </div>
        </div>
    `;
}

// Print prescription
function printPrescription() {
    const prescriptionContent = document.querySelector('.prescription-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Medical Prescription</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { padding: 20px; }
                    .prescription-content { max-width: 800px; margin: 0 auto; }
                    @media print {
                        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="prescription-content">
                    ${prescriptionContent}
                </div>
                <script>
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Doctor list
const doctors = [
    {
        name: "Dr. Pramod Duthade",
        specialty: "General Physician",
        rating: 4.8,
        experience: "15 years",
        contact: "9730561022",
        email: "drpramod@gamil.com",
        availability: "Mon-Fri"
    },
    {
        name: "Dr. Anilkumar Guta",
        specialty: "Internal Medicine",
        rating: 4.9,
        experience: "20 years",
        contact: "8999224804",
        email: "anilkumar@gamail.com",
        availability: "Mon-Sat"
    },
    {
        name: "Dr. Prashant Rathod",
        specialty: "Family Medicine",
        rating: 4.7,
        experience: "12 years",
        contact: "7620224706",
        email: "prashant@gmail.com",
        availability: "Tue-Sat"
    }
];

function loadDoctorList() {
    const doctorListDiv = document.getElementById('doctorList');
    // Clear existing doctor list
    doctorListDiv.innerHTML = '';
    
    doctors.forEach(doctor => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="doctor-card card shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <div class="doctor-avatar me-3">
                            <i class="fas fa-user-md fa-2x text-primary"></i>
                        </div>
                        <div>
                            <h5 class="mb-0">${doctor.name}</h5>
                            <span class="text-muted">${doctor.specialty}</span>
                        </div>
                    </div>
                    <div class="doctor-info">
                        <p class="mb-2">
                            <i class="fas fa-star text-warning me-2"></i>
                            Rating: ${doctor.rating}/5.0
                        </p>
                        <p class="mb-2">
                            <i class="fas fa-clock text-info me-2"></i>
                            Experience: ${doctor.experience}
                        </p>
                        <p class="mb-2">
                            <i class="fas fa-calendar-alt text-success me-2"></i>
                            Available: ${doctor.availability}
                        </p>
                        <hr>
                        <div class="contact-info">
                            <p class="mb-2">
                                <i class="fas fa-phone me-2"></i>
                                ${doctor.contact}
                            </p>
                            <p class="mb-0">
                                <i class="fas fa-envelope me-2"></i>
                                ${doctor.email}
                            </p>
                        </div>
                        <button class="btn btn-primary w-100 mt-3" onclick="scheduleAppointment('${doctor.name}')">
                            Schedule Appointment
                        </button>
                    </div>
                </div>
            </div>
        `;
        doctorListDiv.appendChild(col);
    });
}

function scheduleAppointment(doctorName) {
    showAlert('Appointment Request', `Your appointment request with ${doctorName} has been received. We will contact you shortly.`, 'success');
}

// Utility functions
function showAlert(title, message, type) {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <strong>${title}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const alertContainer = document.createElement('div');
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '20px';
    alertContainer.style.right = '20px';
    alertContainer.style.zIndex = '9999';
    alertContainer.innerHTML = alertHTML;
    
    document.body.appendChild(alertContainer);
    
    setTimeout(() => {
        alertContainer.remove();
    }, 5000);
}
