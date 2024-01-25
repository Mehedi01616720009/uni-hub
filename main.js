const loadSpinner = document.getElementById('loader-spin');

const fetchData = async(dataLimit) => {
    loadSpinner.classList.remove('hidden');
    const fetchUrl = `https://openapi.programming-hero.com/api/ai/tools/`;
    const fetchRequest = await fetch(fetchUrl);
    const fetchProcess = await fetchRequest.json();
    const fetchResults = fetchProcess.data.tools;
    showResult(fetchResults, dataLimit);
}

const fetchSingleData = async(id) => {
    const fetchUrl = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    const fetchRequest = await fetch(fetchUrl);
    const fetchProcess = await fetchRequest.json();
    const fetchResults = fetchProcess.data;
    showSingleResult(fetchResults);
};

function showResult(results, dataLimit) {
    const cardContainer = document.getElementById('card-container');
    const showAllContainer = document.getElementById('show-all-container');
    cardContainer.innerText = '';

    if (dataLimit && results.length > 6) {
        results = results.slice(0, 6);
        showAllContainer.classList.remove('hidden');
    } else {
        showAllContainer.classList.add('hidden');
    }

    results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'p-4 border rounded-xl';
        card.innerHTML = `
        <!-- card -->
        <img src="${result.image}" alt="" class="w-full rounded-xl mb-4">

        <h4 class="text-xl font-semibold mb-3">Features</h4>

        <ul class="text-gray-600 pb-4 border-b card-feature"></ul>

        <div class="flex justify-between items-center gap-3 pt-4">
            <div>
                <h4 class="text-xl font-semibold mb-2">${result.name}</h4>
                <div class="flex items-center gap-1 text-gray-600">
                    <i class='bx bx-calendar'></i>
                    <span>${result['published_in']}</span>
                </div>
            </div>

            <button onclick="fetchSingleData('${result.id}')" class="modal__btn w-10 h-10 flex justify-center items-center bg-red-100 text-red-500 text-2xl rounded-full" data-bs-toggle="modal" data-bs-target="#data-modal">
                <i class='bx bx-right-arrow-alt'></i>
            </button>
        </div>
        `;

        const ul = card.querySelector('.card-feature');
        result.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerText = feature;
            ul.appendChild(li);
        });

        cardContainer.appendChild(card)
    });
    loadSpinner.classList.add('hidden');
}

function showSingleResult(result) {
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <div class="grid grid-cols-2 gap-4 p-8">
            <div class="border border-red-600 bg-red-100 rounded-xl p-8 items-start">
                <p class="text-md font-semibold mb-4">
                    ${result.accuracy.description}
                </p>

                <div class="grid grid-cols-3 gap-3 mb-4">
                    <div class="text-center rounded-xl bg-white font-semibold text-green-600 px-6 py-4">
                        ${result.pricing[0] ? result.pricing[0].price : 'No Cost'}
                    </div>

                    <div class="text-center rounded-xl bg-white font-semibold text-amber-600 px-6 py-4">
                        ${result.pricing[1] ? result.pricing[1].price : 'No Cost'}
                    </div>

                    <div class="text-center rounded-xl bg-white font-semibold text-red-600 px-6 py-4">
                        ${result.pricing[2] ? result.pricing[2].price : 'Contact us'}
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <h4 class="text-lg font-semibold mb-1">Features</h4>

                        <div class="feature__list"></div>
                    </div>

                    <div>
                        <h4 class="text-lg font-semibold mb-1">Integrations</h4>

                        <div class="integrations__list"></div>
                    </div>
                </div>
            </div>

            <div class="border rounded-xl p-3">
                <div class="relative">
                    <img src="${result['image_link'][0]}" alt="" class="rounded-xl">
                    <div class="text-xs bg-red-500 text-white px-3 py-1 absolute top-2 right-2 rounded-lg ${result.accuracy.score ? '' : 'hidden'}">${result.accuracy.score ? result.accuracy.score : ''}</div>
                </div>

                <div class="text-center">
                    <h4 class="text-xl font-semibold my-2">${result.input_output_examples ? result.input_output_examples[0].input : 'Can you give any example?' }</h4>
                    <p>${result.input_output_examples ? result.input_output_examples[0].output : 'No! Not Yet! Take a break!!!' }</p>
                </div>
            </div>
        </div>
        `;

        
    //features
    const featureListContainer = modalBody.querySelector('.feature__list');
    const featureList = document.createElement('ul');
    for (const feature in result.features) {
        const featureItem = document.createElement('li');
        featureItem.className = 'text-sm';
        featureItem.innerText = `${result.features[feature].feature_name}`;
        
        featureList.appendChild(featureItem);
    }

    featureListContainer.appendChild(featureList);

    // integrations
    const integrationsListContainer = modalBody.querySelector('.integrations__list');
    const integrationsList = document.createElement('ul');
    result.integrations.forEach(integration => {
        const integrationsItem = document.createElement('li');
        integrationsItem.className = 'text-sm';
        integrationsItem.innerText = `${integration}`;

        integrationsList.appendChild(integrationsItem);
    })

    integrationsListContainer.appendChild(integrationsList);
}

const showAllBtn = document.getElementById('show-all-btn');
showAllBtn.addEventListener('click', () => {
    fetchData()
});

fetchData(6);