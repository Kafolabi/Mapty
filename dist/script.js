// 'use strict';

// class Workout {
//   date = new Date();
//   id = (Date.now() + '').slice(-10);
//   clicks = 0;

//   constructor(coords, distance, duration) {
//     this.coords = coords; // [lat, lng]
//     this.distance = distance; // in km
//     this.duration = duration; // in min
//   }

//   _setDescription() {
//     const months = [
//       'January',
//       'February',
//       'March',
//       'April',
//       'May',
//       'June',
//       'July',
//       'August',
//       'September',
//       'October',
//       'November',
//       'December',
//     ];

//     this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
//       months[this.date.getMonth()]
//     } ${this.date.getDate()}`;
//   }

//   click() {
//     this.clicks++;
//   }
// }

// class Running extends Workout {
//   type = 'running';

//   constructor(coords, distance, duration, cadence) {
//     super(coords, distance, duration);
//     this.cadence = cadence;
//     this.calcPace();
//     this._setDescription();
//   }

//   calcPace() {
//     this.pace = this.duration / this.distance;
//     return this.pace;
//   }
// }

// class Cycling extends Workout {
//   type = 'cycling';

//   constructor(coords, distance, duration, elevationGain) {
//     super(coords, distance, duration);
//     this.elevationGain = elevationGain;
//     this.calcSpeed();
//     this._setDescription();
//   }

//   calcSpeed() {
//     this.speed = this.distance / (this.duration / 60);
//     return this.speed;
//   }
// }

// // DOM elements
// const form = document.querySelector('.form');
// const containerWorkouts = document.querySelector('.workouts');
// const inputType = document.querySelector('.form__input--type');
// const inputDistance = document.querySelector('.form__input--distance');
// const inputDuration = document.querySelector('.form__input--duration');
// const inputCadence = document.querySelector('.form__input--cadence');
// const inputElevation = document.querySelector('.form__input--elevation');
// const deleteBtn = document.querySelector('.delete-all-btn');
// // const editBtn = document.querySelector('.workout__edit');

// class App {
//   #map;
//   #mapZoomLevel = 13;
//   #mapEvent;
//   #workouts = [];

//   constructor() {
//     this._getPosition();

//     form.addEventListener('submit', this._newWorkout.bind(this));
//     inputType.addEventListener('change', this._toggleElevationField);
//     containerWorkouts.addEventListener(
//       'click',
//       this._handleWorkoutClick.bind(this)
//     );
//     deleteBtn.addEventListener('click', this._deleteAllWorkouts.bind(this));
//   }

//   _getPosition() {
//     if (navigator.geolocation)
//       navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () =>
//         alert('Could not get your position')
//       );
//   }

//   _loadMap(position) {
//     const { latitude, longitude } = position.coords;
//     const coords = [latitude, longitude];

//     this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

//     L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//       attribution:
//         '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(this.#map);

//     this.#map.on('click', this._showForm.bind(this));

//     this._getLocalStorage();
//   }

//   _showForm(mapE) {
//     this.#mapEvent = mapE;
//     form.classList.remove('hidden');
//     inputDistance.focus();
//   }

//   _hideForm() {
//     inputDistance.value =
//       inputDuration.value =
//       inputCadence.value =
//       inputElevation.value =
//         '';
//     form.style.display = 'none';
//     form.classList.add('hidden');
//     setTimeout(() => (form.style.display = 'grid'), 1000);
//   }

//   _toggleElevationField() {
//     inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
//     inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
//   }

//   _newWorkout(e) {
//     e.preventDefault();

//     const type = inputType.value;
//     const distance = +inputDistance.value;
//     const duration = +inputDuration.value;

//     const coords = this.#mapEvent
//       ? [this.#mapEvent.latlng.lat, this.#mapEvent.latlng.lng]
//       : this.#map.getCenter().toArray();

//     let workout;

//     const validInputs = (...inputs) =>
//       inputs.every(inp => Number.isFinite(inp));
//     const allPositive = (...inputs) => inputs.every(inp => inp > 0);

//     if (type === 'running') {
//       const cadence = +inputCadence.value;
//       if (
//         !validInputs(distance, duration, cadence) ||
//         !allPositive(distance, duration, cadence)
//       )
//         return alert('Inputs must be positive numbers!');
//       workout = new Running(coords, distance, duration, cadence);
//     }

//     if (type === 'cycling') {
//       const elevation = +inputElevation.value;
//       if (
//         !validInputs(distance, duration, elevation) ||
//         !allPositive(distance, duration)
//       )
//         return alert('Inputs must be positive numbers!');
//       workout = new Cycling(coords, distance, duration, elevation);
//     }

//     if (!workout) return;

//     this.#workouts.push(workout);
//     this._renderWorkoutMarker(workout);
//     this._renderWorkout(workout);
//     this._hideForm();
//     this._setLocalStorage();
//   }

//   _renderWorkoutMarker(workout) {
//     const marker = L.marker(workout.coords)
//       .addTo(this.#map)
//       .bindPopup(
//         L.popup({
//           maxWidth: 250,
//           minWidth: 100,
//           autoClose: false,
//           closeOnClick: false,
//           className: `${workout.type}-popup`,
//         })
//       )
//       .setPopupContent(
//         `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
//       )
//       .openPopup();

//     workout.marker = marker;
//   }

//   _renderWorkout(workout) {
//     let html = `
//       <li class="workout workout--${workout.type}" data-id="${workout.id}">
//         <h2 class="workout__title">${workout.description}</h2>
//         <button class="workout__edit">✎</button>
//         <button class="workout__close">×</button>
//         <div class="workout__details">
//           <span class="workout__icon">${
//             workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
//           }</span>
//           <span class="workout__value">${workout.distance}</span>
//           <span class="workout__unit">km</span>
//         </div>
//         <div class="workout__details">
//           <span class="workout__icon">⏱</span>
//           <span class="workout__value">${workout.duration}</span>
//           <span class="workout__unit">min</span>
//         </div>
//     `;

//     if (workout.type === 'running')
//       html += `
//         <div class="workout__details">
//           <span class="workout__icon">⚡️</span>
//           <span class="workout__value">${workout.pace.toFixed(1)}</span>
//           <span class="workout__unit">min/km</span>
//         </div>
//         <div class="workout__details">
//           <span class="workout__icon">🦶🏼</span>
//           <span class="workout__value">${workout.cadence}</span>
//           <span class="workout__unit">spm</span>
//         </div>
//       </li>
//       `;

//     if (workout.type === 'cycling')
//       html += `
//         <div class="workout__details">
//           <span class="workout__icon">⚡️</span>
//           <span class="workout__value">${workout.speed.toFixed(1)}</span>
//           <span class="workout__unit">km/h</span>
//         </div>
//         <div class="workout__details">
//           <span class="workout__icon">⛰</span>
//           <span class="workout__value">${workout.elevationGain}</span>
//           <span class="workout__unit">m</span>
//         </div>
//       </li>
//       `;

//     containerWorkouts.insertAdjacentHTML('beforeend', html);

//     // 🚀 Scroll to the latest workout
//     setTimeout(() => {
//       document
//         .querySelector('.workout:last-child')
//         .scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   }

//   _handleWorkoutClick(e) {
//     const workoutEl = e.target.closest('.workout');
//     if (!workoutEl) return;

//     if (e.target.classList.contains('workout__close')) {
//       this._deleteWorkout(workoutEl.dataset.id);
//     } else if (e.target.classList.contains('workout__edit')) {
//       const workout = this.#workouts.find(
//         work => work.id === workoutEl.dataset.id
//       );
//       // console.log('Edit workout:', workout); // Placeholder for edit logic
//       this._editWorkouts(workout.id);
//     } else {
//       const workout = this.#workouts.find(
//         work => work.id === workoutEl.dataset.id
//       );
//       this.#map.setView(workout.coords, this.#mapZoomLevel, {
//         animate: true,
//         pan: { duration: 1 },
//       });
//     }
//   }

//   _deleteWorkout(workoutId) {
//     const index = this.#workouts.findIndex(work => work.id === workoutId);
//     if (index === -1) return;

//     const workout = this.#workouts[index];
//     if (workout.marker) {
//       // Explicitly close the popup before removing the marker
//       workout.marker.closePopup();
//       this.#map.removeLayer(workout.marker);
//     }

//     this.#workouts.splice(index, 1);
//     document.querySelector(`[data-id="${workoutId}"]`)?.remove();
//     this._setLocalStorage();
//   }

//   _editWorkouts(workoutId) {
//     const index = this.#workouts.findIndex(work => work.id === workoutId);
//     if (index === -1) return;

//     const workout = this.#workouts[index];
//     console.log(workout);
//   }

//   _deleteAllWorkouts() {
//     if (!this.#workouts.length) return;

//     this.#workouts.forEach(workout => {
//       if (workout.marker) {
//         workout.marker.closePopup();
//         this.#map.removeLayer(workout.marker);
//       }
//     });

//     this.#workouts = [];
//     const workoutItems = containerWorkouts.querySelectorAll('.workout');
//     workoutItems.forEach(item => item.remove());
//     this._hideForm();
//     this._setLocalStorage();

//     this.#map.dragging.enable();
//     this.#map.touchZoom.enable();
//     this.#map.doubleClickZoom.enable();
//     this.#map.scrollWheelZoom.enable();
//   }

//   _setLocalStorage() {
//     localStorage.setItem(
//       'workouts',
//       JSON.stringify(
//         this.#workouts.map(workout => {
//           const copy = { ...workout };
//           delete copy.marker;
//           return copy;
//         })
//       )
//     );
//   }

//   _getLocalStorage() {
//     const data = JSON.parse(localStorage.getItem('workouts'));
//     if (!data) return;

//     this.#workouts = data;
//     this.#workouts.forEach(work => {
//       this._renderWorkout(work);
//       this._renderWorkoutMarker(work);
//     });
//   }

//   reset() {
//     localStorage.removeItem('workouts');
//     location.reload();
//   }
// }

// const app = new App();

'use strict';

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// DOM elements
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const deleteBtn = document.querySelector('.delete-all-btn');

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  #editingWorkoutId = null; // Track the workout being edited

  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener(
      'click',
      this._handleWorkoutClick.bind(this)
    );
    deleteBtn.addEventListener('click', this._deleteAllWorkouts.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () =>
        alert('Could not get your position')
      );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));

    this._getLocalStorage();
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    this.#editingWorkoutId = null; // Reset edit mode for new workout
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    const coords = this.#mapEvent
      ? [this.#mapEvent.latlng.lat, this.#mapEvent.latlng.lng]
      : this.#map.getCenter().toArray();

    let workout;

    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs must be positive numbers!');
      workout = new Running(coords, distance, duration, cadence);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs must be positive numbers!');
      workout = new Cycling(coords, distance, duration, elevation);
    }

    if (!workout) return;

    if (this.#editingWorkoutId) {
      // Update existing workout
      const index = this.#workouts.findIndex(
        w => w.id === this.#editingWorkoutId
      );
      if (index !== -1) {
        const oldWorkout = this.#workouts[index];
        this.#workouts[index] = workout;
        this.#workouts[index].id = this.#editingWorkoutId; // Preserve original ID
        this.#workouts[index].date = oldWorkout.date; // Preserve original date
        if (oldWorkout.marker) {
          oldWorkout.marker.closePopup();
          this.#map.removeLayer(oldWorkout.marker);
        }
        this._renderWorkoutMarker(this.#workouts[index]);
        document
          .querySelector(`[data-id="${this.#editingWorkoutId}"]`)
          ?.remove();
        this._renderWorkout(this.#workouts[index]);
      }
      this.#editingWorkoutId = null; // Reset edit mode
    } else {
      // Add new workout
      this.#workouts.push(workout);
      this._renderWorkoutMarker(workout);
      this._renderWorkout(workout);
    }

    this._hideForm();
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    const marker = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();

    workout.marker = marker;
  }

  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <button class="workout__edit">✎</button>
        <button class="workout__close">×</button>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;

    containerWorkouts.insertAdjacentHTML('beforeend', html);

    // Scroll to the latest workout
    setTimeout(() => {
      document
        .querySelector('.workout:last-child')
        .scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  _handleWorkoutClick(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    if (e.target.classList.contains('workout__close')) {
      this._deleteWorkout(workoutEl.dataset.id);
    } else if (e.target.classList.contains('workout__edit')) {
      const workout = this.#workouts.find(
        work => work.id === workoutEl.dataset.id
      );
      this._editWorkout(workout); // Updated to match method name
    } else {
      const workout = this.#workouts.find(
        work => work.id === workoutEl.dataset.id
      );
      this.#map.setView(workout.coords, this.#mapZoomLevel, {
        animate: true,
        pan: { duration: 1 },
      });
    }
  }

  _editWorkout(workout) {
    this.#editingWorkoutId = workout.id;
    form.classList.remove('hidden');
    inputType.value = workout.type;
    inputDistance.value = workout.distance;
    inputDuration.value = workout.duration;

    if (workout.type === 'running') {
      inputCadence.value = workout.cadence;
      inputElevation.closest('.form__row').classList.add('form__row--hidden');
      inputCadence.closest('.form__row').classList.remove('form__row--hidden');
    } else if (workout.type === 'cycling') {
      inputElevation.value = workout.elevationGain;
      inputCadence.closest('.form__row').classList.add('form__row--hidden');
      inputElevation
        .closest('.form__row')
        .classList.remove('form__row--hidden');
    }

    this.#mapEvent = {
      latlng: { lat: workout.coords[0], lng: workout.coords[1] },
    }; // Preserve original coords
    inputDistance.focus();
  }

  _deleteWorkout(workoutId) {
    const index = this.#workouts.findIndex(work => work.id === workoutId);
    if (index === -1) return;

    const workout = this.#workouts[index];
    if (workout.marker) {
      workout.marker.closePopup();
      this.#map.removeLayer(workout.marker);
    }

    this.#workouts.splice(index, 1);
    document.querySelector(`[data-id="${workoutId}"]`)?.remove();
    this._setLocalStorage();
  }

  _deleteAllWorkouts() {
    if (!this.#workouts.length) return;

    this.#workouts.forEach(workout => {
      if (workout.marker) {
        workout.marker.closePopup();
        this.#map.removeLayer(workout.marker);
      }
    });

    this.#workouts = [];
    const workoutItems = containerWorkouts.querySelectorAll('.workout');
    workoutItems.forEach(item => item.remove());
    this._hideForm();
    this._setLocalStorage();

    this.#map.dragging.enable();
    this.#map.touchZoom.enable();
    this.#map.doubleClickZoom.enable();
    this.#map.scrollWheelZoom.enable();
  }

  _setLocalStorage() {
    localStorage.setItem(
      'workouts',
      JSON.stringify(
        this.#workouts.map(workout => {
          const copy = { ...workout };
          delete copy.marker;
          return copy;
        })
      )
    );
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    this.#workouts = data;
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
      this._renderWorkoutMarker(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
