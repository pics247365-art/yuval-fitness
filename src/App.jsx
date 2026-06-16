import { useEffect, useState } from 'react';

const storageKey = 'yuvalFitnessWorkouts';
const templates = {
  'Full Body': ['Squat', 'Bench Press', 'Lat Pulldown', 'Shoulder Press'],
  Push: ['Bench Press', 'Incline Press', 'Shoulder Press', 'Triceps Pushdown'],
  Pull: ['Lat Pulldown', 'Seated Row', 'Barbell Row', 'Dumbbell Curl'],
  Legs: ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl']
};
const library = ['Bench Press', 'Incline Press', 'Cable Fly', 'Push Up', 'Lat Pulldown', 'Seated Row', 'Barbell Row', 'Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl', 'Shoulder Press', 'Lateral Raise', 'Dumbbell Curl', 'Triceps Pushdown', 'Plank'];

const makeId = () => String(Date.now()) + String(Math.random()).slice(2);

export default function App() {
  const [screen, setScreen] = useState('home');
  const [workouts, setWorkouts] = useState(() => JSON.parse(localStorage.getItem(storageKey) || '[]'));
  const [activeId, setActiveId] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(workouts)), [workouts]);

  const active = workouts.find(w => w.id === activeId);
  const results = library.filter(x => x.toLowerCase().includes(query.toLowerCase()));

  function createWorkout(templateName) {
    const workout = {
      id: makeId(),
      name: templateName + ' Workout',
      exercises: templates[templateName].map(name => ({ id: makeId(), name, sets: 4, reps: 10, rest: 90 }))
    };
    setWorkouts([workout, ...workouts]);
    setActiveId(workout.id);
    setScreen('editor');
  }

  function updateExercise(exerciseId, field, value) {
    setWorkouts(workouts.map(w => w.id !== activeId ? w : { ...w, exercises: w.exercises.map(e => e.id !== exerciseId ? e : { ...e, [field]: value }) }));
  }

  function deleteExercise(exerciseId) {
    setWorkouts(workouts.map(w => w.id !== activeId ? w : { ...w, exercises: w.exercises.filter(e => e.id !== exerciseId) }));
  }

  function addExercise(name) {
    if (!active) return;
    setWorkouts(workouts.map(w => w.id !== activeId ? w : { ...w, exercises: [...w.exercises, { id: makeId(), name, sets: 3, reps: 10, rest: 60 }] }));
    setScreen('editor');
  }

  return (
    <main className="app">
      <header className="topbar"><b>YUVAL FITNESS</b>{screen !== 'home' && <button onClick={() => setScreen('home')}>Back</button>}</header>

      {screen === 'home' && <section className="panel"><h1>Workout Builder</h1><button className="primary" onClick={() => setScreen('new')}>New Workout</button><button onClick={() => setScreen('workouts')}>My Workouts</button><button onClick={() => setScreen('library')}>Exercise Library</button></section>}

      {screen === 'new' && <section className="panel"><h2>Choose Template</h2>{Object.keys(templates).map(t => <button className="card" key={t} onClick={() => createWorkout(t)}>{t}</button>)}</section>}

      {screen === 'workouts' && <section className="panel"><h2>My Workouts</h2>{workouts.map(w => <button className="card" key={w.id} onClick={() => { setActiveId(w.id); setScreen('editor'); }}>{w.name}<span>{w.exercises.length} exercises</span></button>)}</section>}

      {screen === 'editor' && active && <section className="panel"><input className="title" value={active.name} onChange={e => setWorkouts(workouts.map(w => w.id === active.id ? { ...w, name: e.target.value } : w))} /><button className="primary" onClick={() => window.print()}>Export PDF</button>{active.exercises.map(ex => <div className="row" key={ex.id}><b>{ex.name}</b><label>Sets<input value={ex.sets} onChange={e => updateExercise(ex.id, 'sets', e.target.value)} /></label><label>Reps<input value={ex.reps} onChange={e => updateExercise(ex.id, 'reps', e.target.value)} /></label><label>Rest<input value={ex.rest} onChange={e => updateExercise(ex.id, 'rest', e.target.value)} /></label><button className="danger" onClick={() => deleteExercise(ex.id)}>Delete</button></div>)}<button onClick={() => setScreen('library')}>Add Exercise</button></section>}

      {screen === 'library' && <section className="panel"><h2>Exercise Library</h2><input className="search" placeholder="Search" value={query} onChange={e => setQuery(e.target.value)} />{results.map(name => <button className="card" key={name} onClick={() => addExercise(name)}>{name}</button>)}</section>}
    </main>
  );
}
