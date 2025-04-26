    document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const weightUnit = document.getElementById('weight-unit');
    const heightUnit = document.getElementById('height-unit');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');
    const bmiValueElement = document.getElementById('bmi-value');
    const bmiCategoryElement = document.getElementById('bmi-category');
    const bmiDescriptionElement = document.getElementById('bmi-description');
    
    // Chart instance
    let bmiChart = null;
    
    // BMI category ranges
    const bmiCategories = [
        { range: [0, 18.5], name: 'Underweight', color: '#4baae3', description: 'You are underweight. Consider gaining some weight.' },
        { range: [18.5, 25], name: 'Normal', color: '#2ecc71', description: 'You have a normal body weight. Good job!' },
        { range: [25, 30], name: 'Overweight', color: '#f1c40f', description: 'You are overweight. Consider losing some weight.' },
        { range: [30, 100], name: 'Obese', color: '#e74c3c', description: 'You are obese. It is recommended to lose weight.' }
    ];
    // Initialize the chart
    function initChart() {
        const ctx = document.getElementById('bmi-chart').getContext('2d');
        
        // Data for the chart
        const data = {
            labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
            datasets: [{
                label: 'BMI Categories',
                data: [18.5, 6.5, 5, 10], // Representing the width of each category
                backgroundColor: ['#4baae3', '#2ecc71', '#f1c40f', '#e74c3c'],
                borderWidth: 0
            }]
        };
        // Chart configuration
        const config = {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true,
                        max: 40,
                        title: {
                            display: true,
                            text: 'BMI Range'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Category'
                        }
                    }
                },

    plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const index = context.dataIndex;
                                if (index === 0) return 'BMI < 18.5';
                                if (index === 1) return '18.5 - 24.9';
                                if (index === 2) return '25 - 29.9';
                                if (index === 3) return 'BMI ≥ 30';
                                return '';
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
    
    // Simplified updateChartMarker without annotations
    function updateChartMarker(bmi) {
        if (!bmiChart) return;
        
        // Instead of using annotations, we'll add a text on the chart
        const category = getBMICategory(bmi);
        const ctx = bmiChart.ctx;
        const chartArea = bmiChart.chartArea;
        
        // Draw a simple vertical line for the BMI position
        const xPos = bmiChart.scales.x.getPixelForValue(bmi);
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xPos, chartArea.top);
        ctx.lineTo(xPos, chartArea.bottom);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
         // Add text label
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('Your BMI: ' + bmi.toFixed(1), xPos, chartArea.top - 20);
        ctx.restore();
    }
    // Calculate BMI
    function calculateBMI(weight, height, weightUnit, heightUnit) {
        // Convert weight to kg if needed
        if (weightUnit === 'lb') {
            weight = weight * 0.453592; // lb to kg
        }
        
        // Convert height to meters if needed
        if (heightUnit === 'cm') {
            height = height / 100; // cm to m
        } else if (heightUnit === 'ft') {
            height = height * 0.3048; // ft to m
        }
         // BMI formula: weight (kg) / (height (m) * height (m))
        return weight / (height * height);
    }
// BMI formula: weight (kg) / (height (m) * height (m))
        return weight / (height * height);
    }
    // Get BMI category
    function getBMICategory(bmi) {
        for (const category of bmiCategories) {
            if (bmi >= category.range[0] && bmi < category.range[1]) {
                return category;
            }
        }
        return bmiCategories[bmiCategories.length - 1]; // Default to last category if out of range
    } 
// Display results
    function displayResults(bmi) {
        const category = getBMICategory(bmi);
        
        // Display BMI value
        bmiValueElement.textContent = bmi.toFixed(1);
        
        // Display category
        bmiCategoryElement.textContent = category.name;
        bmiCategoryElement.className = 'bmi-category ' + category.name.toLowerCase();
        
        // Display description
        bmiDescriptionElement.textContent = category.description;
        
        // Show results
        resultContainer.classList.remove('hidden');
        
        // Initialize or update chart
        if (!bmiChart) {
            initChart();
        }

       
