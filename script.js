document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const inchesInput = document.getElementById('inches');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const weightUnit = document.getElementById('weight-unit');
    const heightUnit = document.getElementById('height-unit');
    const inchesField = document.getElementById('inches-field');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const bmiValueElement = document.getElementById('bmi-value');
    const bmiCategoryElement = document.getElementById('bmi-category');
    const bmiDescriptionElement = document.getElementById('bmi-description');
    const bmiTipElement = document.getElementById('bmi-tip');
    const alertMessage = document.getElementById('alert-message');
    const themeToggle = document.getElementById('theme-toggle');
    const bmiHistoryList = document.getElementById('bmi-history');

    // BMI Categories
    const bmiCategories = [
        {
            range: [0, 18.5],
            name: 'Underweight',
            class: 'underweight',
            color: '#5dade2',
            icon: '🦴',
            description: 'You may benefit from gaining a bit of weight for better energy and health.',
            tip: 'Focus on nutrient-dense foods and consider consulting with a nutritionist.'
        },
        {
            range: [18.5, 25],
            name: 'Normal',
            class: 'normal',
            color: '#27ae60',
            icon: '💪',
            description: 'You're in a healthy weight range — keep up the good habits!',
            tip: 'Maintain a balanced diet and regular physical activity.'
        },
        {
            range: [25, 30],
            name: 'Overweight',
            class: 'overweight',
            color: '#f39c12',
            icon: '⚖️',
            description: 'Consider small lifestyle changes to get back to a healthier range.',
            tip: 'Incorporate more physical activity and mindful eating habits.'
        },
        {
            range: [30, Infinity],
            name: 'Obese',
            class: 'obese',
            color: '#e74c3c',
            icon: '❤️‍🔥',
            description: 'Adopting healthier habits could greatly benefit your well-being.',
            tip: 'Consider consulting with healthcare professionals for a personalized plan.'
        }
    ];

    // Global Chart Variable
    let bmiChart;
    
    // BMI History
    let bmiHistory = JSON.parse(localStorage.getItem('bmiHistory')) || [];

    // Initialize
    init();

    function init() {
        // Event Listeners
        heightUnit.addEventListener('change', toggleInchesField);
        calculateBtn.addEventListener('click', handleCalculate);
        resetBtn.addEventListener('click', resetForm);
        themeToggle.addEventListener('click', toggleTheme);
        
        // Check for saved theme preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️ Toggle Theme';
        }
        
        // Render BMI history
        renderBMIHistory();
    }

    function toggleInchesField() {
        if (heightUnit.value === 'ft-in') {
            inchesField.classList.remove('hidden');
        } else {
            inchesField.classList.add('hidden');
        }
    }

    function toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        themeToggle.textContent = isDarkMode ? '☀️ Toggle Theme' : '🌙 Toggle Theme';
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        
        // Update chart if it exists
        if (bmiChart) {
            const textColor = isDarkMode ? '#ecf0f1' : '#333';
            bmiChart.options.scales.x.ticks.color = textColor;
            bmiChart.options.scales.y.ticks.color = textColor;
            bmiChart.options.scales.x.title.color = textColor;
            bmiChart.options.scales.y.title.color = textColor;
            bmiChart.update();
        }
    }

    // Get BMI Category
    function getBMICategory(bmi) {
        return bmiCategories.find(category => bmi >= category.range[0] && bmi < category.range[1]) || bmiCategories[bmiCategories.length - 1];
    }

    // Calculate BMI Function
    function calculateBMI() {
        let weight = parseFloat(weightInput.value);
        let height = parseFloat(heightInput.value);
        
        // Validation
        if (!weight || !height || weight <= 0 || height <= 0) {
            showAlert('Please provide valid weight and height values.');
            return null;
        }

        // Convert units
        if (weightUnit.value === 'lb') {
            weight *= 0.453592; // Convert pounds to kg
        }
        
        if (heightUnit.value === 'cm') {
            height /= 100; // Convert cm to m
        } else if (heightUnit.value === 'ft') {
            height *= 0.3048; // Convert feet to m
        } else if (heightUnit.value === 'ft-in') {
            const inches = parseFloat(inchesInput.value) || 0;
            height = (height * 0.3048) + (inches * 0.0254); // Convert feet and inches to m
        }

        // Final check for valid height after conversion
        if (height <= 0) {
            showAlert('Please provide a valid height value.');
            return null;
        }

        const bmi = weight / (height * height);
        const roundedBMI = parseFloat(bmi.toFixed(1));
        const category = getBMICategory(roundedBMI);

        return {
            bmi: roundedBMI,
            category: category.name,
            class: category.class,
            color: category.color,
            icon: category.icon,
            description: category.description,
            tip: category.tip,
            date: new Date().toISOString(),
            weight: weight,
            height: height,
            age: ageInput.value || 'N/A',
            gender: genderSelect.value || 'N/A'
        };
    }

    // Show Alert
    function showAlert(message, type = 'error') {
        alertMessage.textContent = message;
        alertMessage.className = `alert ${type === 'error' ? 'danger' : 'success'}`;
        alertMessage.classList.remove('hidden');
        
        // Hide after 3 seconds
        setTimeout(() => {
            alertMessage.classList.add('hidden');
        }, 3000);
    }

    // Initialize the Chart
    function initChart() {
        const ctx = document.getElementById('bmi-chart').getContext('2d');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#ecf0f1' : '#333';
        
        const data = {
            labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
            datasets: [{
                label: 'BMI Categories',
                data: [18.5, 6.5, 5, 10], // Width of ranges
                backgroundColor: ['#5dade2', '#27ae60', '#f39c12', '#e74c3c'],
                borderWidth: 0
            }]
        };

        const config = {
            type: 'bar',
            data,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true,
                        max: 40,
                        ticks: { color: textColor },
                        title: {
                            display: true,
                            text: 'BMI Range',
                            color: textColor
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: textColor },
                        title: {
                            display: true,
                            text: 'Category',
                            color: textColor
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: ({ dataIndex }) => {
                                const labels = [
                                    'BMI < 18.5',
                                    '18.5 - 24.9',
                                    '25 - 29.9',
                                    'BMI ≥ 30'
                                ];
                                return labels[dataIndex] || '';
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        };

        bmiChart = new Chart(ctx, config);
    }

    // Update Chart Marker
    function updateChartMarker(bmi) {
        if (!bmiChart) return;

        // Apply annotation
        const xScale = bmiChart.scales.x;
        const chartWidth = bmiChart.width;
        const chartHeight = bmiChart.height;
        
        // Get the value position for the user's BMI
        const xPos = xScale.getPixelForValue(bmi);
        
        // Draw a vertical line and label on the chart
        const ctx = bmiChart.ctx;
        ctx.save();
        
        // Draw vertical line
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(xPos, bmiChart.chartArea.top);
        ctx.lineTo(xPos, bmiChart.chartArea.bottom);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.stroke();
        
        // Draw label
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Your BMI: ${bmi}`, xPos, bmiChart.chartArea.top - 10);
        
        ctx.restore();
        
        // Update the chart
        bmiChart.update();
    }

    // Handle Calculate Button Click
    function handleCalculate() {
        // Calculate BMI
        const result = calculateBMI();
        
        if (!result) return; // Error occurred
        
        // Save to history
        saveToHistory(result);
        
        // Display results
        displayResults(result);
    }

    // Display Results
    function displayResults(result) {
        // Update DOM
        bmiValueElement.textContent = result.bmi.toFixed(1);
        bmiCategoryElement.textContent = `${result.icon} ${result.category}`;
        
        // Remove any previous category classes
        bmiCategoryElement.className = 'bmi-category';
        // Add the appropriate class
        bmiCategoryElement.classList.add(result.class);
        
        bmiDescriptionElement.textContent = result.description;
        bmiTipElement.textContent = result.tip;
        
        // Show result container
        resultContainer.classList.remove('hidden');
        
        // Initialize or update chart
        if (!bmiChart) {
            initChart();
        }
        
        // Update chart marker with the BMI result
        updateChartMarker(result.bmi);
    }

    // Save to BMI History
    function saveToHistory(result) {
        // Create a simplified history entry
        const historyEntry = {
            date: result.date,
            bmi: result.bmi,
            category: result.category,
            weight: result.weight,
            height: result.height
        };
        
        // Add to history array
        bmiHistory.unshift(historyEntry);
        
        // Keep only the last 5 entries
        if (bmiHistory.length > 5) {
            bmiHistory = bmiHistory.slice(0, 5);
        }
        
        // Save to localStorage
        localStorage.setItem('bmiHistory', JSON.stringify(bmiHistory));
        
        // Update the UI
        renderBMIHistory();
    }

    // Render BMI History
    function renderBMIHistory() {
        // Clear the list
        bmiHistoryList.innerHTML = '';
        
        if (bmiHistory.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No history available yet.';
            bmiHistoryList.appendChild(li);
            return;
        }
        
        // Add each history item
        bmiHistory.forEach(entry => {
            const li = document.createElement('li');
            
            const date = new Date(entry.date);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            
            const category = getBMICategory(entry.bmi);
            
            li.innerHTML = `
                <span>${formattedDate}</span>
                <span class="${category.class}">${entry.bmi.toFixed(1)} (${category.name})</span>
            `;
            
            bmiHistoryList.appendChild(li);
        });
    }

    // Reset Form
    function resetForm() {
        weightInput.value = '';
        heightInput.value = '';
        inchesInput.value = '';
        ageInput.value = '';
        genderSelect.selectedIndex = 0;
        resultContainer.classList.add('hidden');
    }
});

       
