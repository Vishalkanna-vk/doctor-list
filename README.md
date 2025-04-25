# Doctor Listing Page

This is a **Doctor Listing Page** developed for the Campus Assessment, showcasing a responsive web application built with **React** and **Tailwind CSS**. The application allows users to search for doctors, filter by consultation type and specialties, and sort by fees or experience, with all filtering and sorting performed client-side. The live deployment is available at: [https://doctor-list-seven.vercel.app/](https://doctor-list-seven.vercel.app/).

## Features

- **Autocomplete Search**: Search bar with dropdown suggestions showing up to 3 matching doctor names based on input.
- **Filter Panel**:
  - **Consultation Type**: Single-select radio buttons for "Video Consult" or "In Clinic".
  - **Specialties**: Multi-select checkboxes for specialties (e.g., Dentist, Gynaecologist, etc.).
  - **Sort Options**: Sort by fees (ascending) or experience (descending).
- **Doctor List**: Displays doctor cards with name, specialties, experience, fees, and photo, fetched from the provided API.
- **Client-Side Processing**: All filtering and sorting are performed on the frontend after the initial API call.
- **URL Query Params**: Applied filters are reflected in the URL, enabling state persistence across browser navigation (back/forward).
- **Responsive UI**: Modern, attractive design with Tailwind CSS, optimized for both mobile and desktop.
- **Test Automation**: Includes all required `data-testid` attributes for test automation.

## Tech Stack

- **Frontend**: React (with JSX)
- **Styling**: Tailwind CSS
- **API**: [https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json](https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json)
- **Deployment**: Vercel
