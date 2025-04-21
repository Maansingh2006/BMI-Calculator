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
  
