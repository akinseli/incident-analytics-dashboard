# Incident Analytics Dashboard

A Google Apps Script-powered incident intelligence and reporting system that analyzes regional and state-level incident data, generates visualizations, and automatically exports executive reports to Google Slides.

## Overview

Incident Analytics Dashboard is designed to transform raw incident records into actionable intelligence.

The system processes incident data stored in Google Sheets, aggregates metrics across Nigeria's geopolitical regions and states, generates charts, produces executive summaries, and exports presentation-ready reports.

The solution supports:

* Regional Top 10 incident analysis
* State-level incident analysis
* Injury, Fatality, and Kidnapping metrics
* Automated bar chart generation
* Automated pie chart generation
* Google Slides report creation
* Dashboard-driven execution workflow



## Key Features

### Regional Analysis

Analyze all geopolitical regions:

* South South (SS)
* South West (SW)
* South East (SE)
* North Central (NC)
* North East (NE)
* North West (NW)

For each region, the system generates:

* Top 10 LGAs by Injury
* Top 10 LGAs by Fatality
* Top 10 LGAs by Kidnapping



### State Analysis

Select a state from the Dashboard and automatically generate:

* State Injury Analysis
* State Fatality Analysis
* State Kidnapping Analysis

Output sheets are created automatically.

Example:

STATE_Borno_Injury

STATE_Borno_Fatality

STATE_Borno_Kidnapped



### Visualization Engine

#### Bar Charts

Automatically creates:

* Injury charts
* Fatality charts
* Kidnapping charts

Charts are generated using:

* LGA names as categories
* Metric values as series



#### Pie Charts

Regional Mode:

* North vs South comparison

State Mode:

* Injury by LGA
* Fatality by LGA
* Kidnapped by LGA

Only LGAs with values greater than zero are included.



### Automated Reporting

Exports charts and summaries directly into Google Slides.

Generated reports include:

* Regional charts
* State charts
* Executive summaries
* Comparative visualizations

Report URLs are automatically written back to the Dashboard.



## Spreadsheet Requirements

Regional source sheets:

* ss
* sw
* se
* nc
* ne
* nw

Dashboard sheet:

* Dashboard

Required columns:

| Column | Description   |
| ------ | ------------- |
| E      | LGA           |
| F      | State         |
| G      | Incident Type |
| J      | Injury        |
| K      | Fatality      |
| L      | Kidnapped     |



## Dashboard Controls

### Regional Workflow

Run in order:

1. Analyze Top 10
2. Generate Bar Charts
3. Generate Pie Charts
4. Export Slides

Functions:

RUN_01_ANALYZE_TOP10()

RUN_02_BAR_CHARTS()

RUN_03_PIE_CHARTS()

RUN_04_EXPORT_SLIDES()



### State Workflow

Select a state in:

Dashboard!B12

Run in order:

1. Analyze State
2. Generate State Bar Charts
3. Generate State Pie Charts
4. Export State Slides

Functions:

RUN_STATE_01_ANALYZE()

RUN_STATE_02_BAR_CHARTS()

RUN_STATE_03_PIE_CHARTS()

RUN_STATE_04_EXPORT_SLIDES()



## Cleanup Utility

Generated sheets can be removed using:

clearGeneratedSheets()

This preserves:

* Dashboard
* ss
* sw
* se
* nc
* ne
* nw

while deleting generated analysis sheets.



## Recommended Repository Structure


src/
│
├── analysis/
│   ├── regional-analysis.gs
│
├── charts/
│   ├── regional-bar-charts.gs
│   ├── regional-pie-charts.gs
│
├── state/
│   ├── state-analysis.gs
│   ├── state-bar-charts.gs
│   ├── state-pie-charts.gs
│   ├── state-slides-export.gs
│   ├── state-slides-charts.gs
│   └── state-summary.gs
│
├── slides/
│   ├── regional-slides-export.gs
│   ├── regional-summary.gs
│
└── utils/
    ├── cleanup.gs


## Deployment

1. Create a Google Spreadsheet.
2. Create required sheets.
3. Open Extensions → Apps Script.
4. Import project files.
5. Save and authorize required permissions.
6. Create Dashboard buttons linked to trigger functions.
7. Run analyses from the Dashboard.



## License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files to deal in the Software without restriction.
