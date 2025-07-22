document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('build-form');
    const loader = document.getElementById('loader');
    const resultsBody = document.getElementById('results-body');
    const benchmarksContainer = document.getElementById('benchmarks-container');
    const compatibilityContainer = document.getElementById('compatibility-container');
    const notesContainer = document.getElementById('notes-container');
    const totalCostEl = document.getElementById('total-cost');
    const shareButton = document.getElementById('share-button');
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.getElementById('budget-value');
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedOptions = document.getElementById('advanced-options');

    if (form) {
        if (advancedToggle && advancedOptions) {
            advancedToggle.addEventListener('click', () => {
                const isHidden = advancedOptions.style.display === 'none';
                advancedOptions.style.display = isHidden ? 'flex' : 'none';
                advancedOptions.style.flexDirection = 'column';
                advancedOptions.style.gap = '25px';
            });
        }

        if (budgetSlider && budgetValue) {
            budgetSlider.addEventListener('input', () => {
                const value = parseInt(budgetSlider.value).toLocaleString('en-IN');
                budgetValue.textContent = `₹${value}`;
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            loader.style.display = 'block';

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const accessories = getTriStateValues();
            if (accessories.include.length > 0) {
                data.accessories = accessories.include.join(', ');
            }
            if (accessories.exclude.length > 0) {
                data.exclude_accessories = accessories.exclude.join(', ');
            }

            try {
                const response = await fetch('/api/get-build-recommendation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Failed to get recommendations.');
                }

                const result = await response.json();
                localStorage.setItem('pcBuildResult', JSON.stringify(result));
                window.location.href = 'results.html';

            } catch (error) {
                alert(error.message);
            } finally {
                loader.style.display = 'none';
            }
        });
    }

    if (shareButton) {
        shareButton.addEventListener('click', () => {
            const result = JSON.parse(localStorage.getItem('pcBuildResult'));
            if (result && result.parts) {
                let shareText = `My AI PC Build (${result.total_cost}):\n\n`;
                result.parts.forEach(part => {
                    shareText += `- ${part.type}: ${part.name} (${part.price})\n`;
                });
                shareText += `\n${result.notes}`;
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('Build details copied to clipboard!');
                });
            }
        });
    }

    if (resultsBody) {
        const result = JSON.parse(localStorage.getItem('pcBuildResult'));

        if (result && result.parts) {
            if (result.total_cost) {
                totalCostEl.textContent = result.total_cost;
            }

            result.parts.forEach(part => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${part.type}</td>
                    <td>${part.name}</td>
                    <td>${part.price}</td>
                    <td>${part.specs}</td>
                    <td>${part.reason}</td>
                `;
                resultsBody.appendChild(row);
            });

            if (result.notes) {
                const notesEl = document.createElement('div');
                notesEl.className = 'notes';
                notesEl.innerHTML = `<h4>Notes:</h4><p>${result.notes.split('Prices shown')[0]}</p><p class="disclaimer">Prices shown in the above table may differ, requesting user to cross check. This is an AI generated response, it can be incorrect too sometimes.</p>`;
                notesContainer.appendChild(notesEl);
            }

            if (result.performance_benchmarks) {
                const benchmarksEl = document.createElement('div');
                benchmarksEl.className = 'component-card';
                benchmarksEl.innerHTML = `
                    <h3>Performance Benchmarks</h3>
                    <p><strong>1080p Gaming:</strong> ${result.performance_benchmarks.gaming_1080p}</p>
                    <p><strong>1440p Gaming:</strong> ${result.performance_benchmarks.gaming_1440p}</p>
                    <p><strong>Productivity Score:</strong> ${result.performance_benchmarks.productivity_score}</p>
                `;
                benchmarksContainer.appendChild(benchmarksEl);
            }

            if (result.compatibility_matrix) {
                const compatibilityEl = document.createElement('div');
                compatibilityEl.className = 'component-card';
                compatibilityEl.innerHTML = `
                    <h3>Compatibility Matrix</h3>
                    <p><strong>CPU & Motherboard:</strong> ${result.compatibility_matrix.cpu_motherboard}</p>
                    <p><strong>RAM & Motherboard:</strong> ${result.compatibility_matrix.ram_motherboard}</p>
                    <p><strong>GPU & Case:</strong> ${result.compatibility_matrix.gpu_case}</p>
                    <p><strong>PSU Wattage:</strong> ${result.compatibility_matrix.psu_wattage}</p>
                `;
                compatibilityContainer.appendChild(compatibilityEl);
            }
        } else {
            resultsBody.innerHTML = '<tr><td colspan="5">No build data found. Please go back and submit your preferences.</td></tr>';
        }
    }

    function setupTriStateCheckboxes() {
        const checkboxes = document.querySelectorAll('.tri-state-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                const currentState = checkbox.dataset.state || 'none';
                let nextState;
                if (currentState === 'none') {
                    nextState = 'include';
                } else if (currentState === 'include') {
                    nextState = 'exclude';
                } else {
                    nextState = 'none';
                }
                checkbox.dataset.state = nextState;
                checkbox.classList.remove('include', 'exclude');
                if (nextState !== 'none') {
                    checkbox.classList.add(nextState);
                }
            });
        });
    }

    function getTriStateValues() {
        const checkboxes = document.querySelectorAll('.tri-state-checkbox');
        const values = {
            include: [],
            exclude: []
        };
        checkboxes.forEach(checkbox => {
            const state = checkbox.dataset.state;
            if (state === 'include') {
                values.include.push(checkbox.dataset.value);
            } else if (state === 'exclude') {
                values.exclude.push(checkbox.dataset.value);
            }
        });
        return values;
    }

    setupTriStateCheckboxes();
});