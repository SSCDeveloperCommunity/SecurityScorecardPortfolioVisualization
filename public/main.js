async function fetchSecurityScorecardPortfolio() {
  try {
    const response = await fetch('/api/securityscorecard/portfolios');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching SecurityScorecard portfolio:', error);
    throw error;
  }
}

async function fetchSecurityScorecardPortfolioCompanies(portfolioId) {
  try {
    const response = await fetch(`/api/securityscorecard/portfolios/${portfolioId}/companies`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio companies:', error);
    throw error;
  }
}

async function visualizePortfolioWithCytoscape() {
  try {
    // Get all portfolios and companies
    const portfolios = await fetchSecurityScorecardPortfolio();

    // console.log('portfolios', portfolios);

    if (!portfolios.entries || portfolios.entries.length === 0) {
      throw new Error('No portfolios found');
    }

    // maybe later Set?
    const portfoliosArray = [];
    const companiesArray = [];

    for (const [index, portfolio] of portfolios.entries.entries()) {
      // console.log('name', portfolio.name, portfolio.id);
      // if (index >= 2) {
      //   break;
      // }
      portfoliosArray.push(portfolio);
      const companies = await fetchSecurityScorecardPortfolioCompanies(portfolio.id);
      // console.log('companies', companies);
      for (const company of companies.entries) {
        companiesArray.push(
          {
            ...company,
            portfolioId: portfolio.id,
          }
        );
      }
    }
    // Create container for Cytoscape
    const container = document.getElementById('cy') || createCytoscapeContainer();

    // Prepare data for visualization
    const nodes = [];
    const edges = [];
    // Add portfolio nodes
    portfoliosArray.forEach(portfolio => {
      // console.log(portfolio.name);
      nodes.push({
        data: {
          id: `portfolio-${portfolio.id}`,
          label: portfolio.name,
          type: 'portfolio',
        }
      });

      // Add company nodes and edges
      companiesArray.forEach(company => {
        // Add node for each company
        // console.log(company);
        nodes.push({
          data: {
            id: `company-${company.uuid}`,
            label: company.name,
            score: company.score,
            'backgroundColor': scoreToColor(company.score),
            type: 'company',
          }
        });

        // Add edge connecting portfolio to company
        // console.log(`edge ${portfolio.id} ${company.uuid}`);
        if (portfolio.id === company.portfolioId) {
          edges.push({
            data: {
              id: `edge-${portfolio.id}-${company.uuid}`,
              source: `portfolio-${portfolio.id}`,
              target: `company-${company.uuid}`
            }
          });
        }
      });
    });

    const elements = {
      nodes,
      edges,
    };
    // console.log('el', elements.length);

    // Initialize Cytoscape
    const cy = cytoscape({
      container: container,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#888',
            'background-color': '#888'
          }
        },
        {
          selector: 'node[type="portfolio"]',
          style: {
            'background-color': '#4287f5',
            'shape': 'diamond',
            'width': 60,
            'height': 60
          }
        },
        {
          selector: 'node[type="company"]',
          style: {
            'background-color': 'data(backgroundColor)',
            // 'red',
            'width': 40,
            'height': 40
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        // name: 'circle',
        name: 'cose',
        padding: 30
      }
    });

    return cy;
  } catch (error) {
    console.error('Error visualizing portfolio:', error);
    throw error;
  }
}

// Helper function to create container if it doesn't exist
function createCytoscapeContainer() {
  const container = document.createElement('div');
  container.id = 'cy';
  container.style.width = '100%';
  container.style.height = '800px';
  container.style.border = '1px solid #ccc';
  document.body.appendChild(container);
  return container;
}

// Helper function to convert security score to color
function scoreToColor(score) {
  if (!score) return '#888'; // Default gray
  if (score >= 90) return '#2ecc71'; // Good - green
  if (score >= 80) return '#f1c40f'; // Warning - yellow
  if (score >= 70) return '#e67e22'; // Concern - orange
  return '#e74c3c'; // Bad - red
}


function showTooltip(node, data) {
  // Create or update tooltip div
  let tooltip = document.getElementById('cy-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'cy-tooltip';
    document.body.appendChild(tooltip);
  }

  // Set visible styles with higher z-index
  tooltip.style.position = 'absolute';
  tooltip.style.backgroundColor = 'white';
  tooltip.style.border = '1px solid black';
  tooltip.style.padding = '10px';
  tooltip.style.borderRadius = '5px';
  tooltip.style.zIndex = '10000'; // Very high z-index
  tooltip.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  tooltip.style.display = 'block'; // Ensure visibility
  tooltip.style.pointerEvents = 'auto'; // Make tooltip clickable
  tooltip.style.opacity = '1'; // Full opacity
  tooltip.style.minWidth = '150px'; // Ensure reasonable size

  // Clear previous content
  tooltip.textContent = '';

  // Add title safely
  const titleElement = document.createElement('strong');
  titleElement.textContent = data.id;
  tooltip.appendChild(titleElement);
  tooltip.appendChild(document.createElement('br'));

  // Add each property safely
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'id') return; // Skip id as it's already shown
    if (key === 'backgroundColor') return;

    const propertyElement = document.createElement('div');
    propertyElement.style.margin = '3px 0';

    // Sanitize key and value
    const keySpan = document.createElement('span');
    keySpan.textContent = `${key}: `;
    keySpan.style.fontWeight = 'bold';

    const valueSpan = document.createElement('span');
    valueSpan.textContent = typeof value === 'object' ?
      JSON.stringify(value) : String(value);

    propertyElement.appendChild(keySpan);
    propertyElement.appendChild(valueSpan);
    tooltip.appendChild(propertyElement);
  });

  // Position near node with offset to not cover the node
  const pos = node.renderedPosition();
  const container = node.cy().container();
  const rect = container.getBoundingClientRect();

  tooltip.style.left = `${rect.left + pos.x + 20}px`;
  tooltip.style.top = `${rect.top + pos.y}px`;

  // Make sure we don't go off-screen
  const tooltipRect = tooltip.getBoundingClientRect();
  if (tooltipRect.right > window.innerWidth) {
    tooltip.style.left = `${rect.left + pos.x - tooltipRect.width - 20}px`;
  }
  if (tooltipRect.bottom > window.innerHeight) {
    tooltip.style.top = `${rect.top + pos.y - tooltipRect.height}px`;
  }

  // Add close button
  const closeBtn = document.createElement('div');
  closeBtn.textContent = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '5px';
  closeBtn.style.right = '5px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontWeight = 'bold';
  closeBtn.style.fontSize = '16px';
  closeBtn.addEventListener('click', () => tooltip.remove());
  tooltip.appendChild(closeBtn);

  // Remove on click elsewhere
  setTimeout(() => {
    document.addEventListener('click', function removeTooltip(e) {
      if (!tooltip.contains(e.target) && e.target !== node.element()) {
        tooltip.remove();
        document.removeEventListener('click', removeTooltip);
      }
    });
  }, 100); // Small delay to prevent immediate closing
}


// Run the visualization
visualizePortfolioWithCytoscape()
  .then(cy => {
    // Add click event listener to nodes
    cy.on('click', 'node', function(evt) {
      const node = evt.target;
      const nodeData = node.data();
      showTooltip(node, nodeData);
    });
    console.log('Visualization complete');
  })
  .catch(error => console.error(error));
