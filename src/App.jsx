import { useEffect, useMemo, useState } from 'react';

const storageKey = 'yuvalFitnessWorkouts';

const templates = {
  'Full Body': ['Squat', 'Bench Press', 'Lat Pulldown', 'Shoulder Press'],
  Push: ['Bench Press', 'Incline Press', 'Shoulder Press', 'Triceps Pushdown'],
  Pull: ['Lat Pulldown', 'Seated Row', 'Barbell Row', 'Dumbbell Curl'],
  Legs: ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl']
};

const library = [
  'Bench Press', 'Incline Press', 'Cable Fly', 'Push Up',
  'Lat Pulldown', 'Seated Row', 'Barbell Row', 'Pull Up',
  'Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl',
  'Shoulder Press', 'Lateral Raise', 'Face Pull',
  'Dumbbell Curl', 'Hammer Curl', 'Triceps Pushdown', 'Plank'
];

const makeId = () => String(Date.now()) + String(Math.random()).slice(2);

export default function App() {
  const [screen, setScreen] = useState('home');
  const [workouts, setWorkouts] = useState(() => JSON.parse(localStorage.getItem(storageKey) || '[]'));
  const [activeId, setActiveId] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(workouts));
  }, [workouts]);

  const active = workouts.find((w) => w.id === activeId);
  const results = useMemo(() => library.filter((x) => x.toLowerCase().includes(query.toLowerCase())), [query]);

  function createWorkout(templateName) {
    const workout = {
      id: makeId(),
      name: `${templateName} Workout`,
      createdAt: new Date().toISOString(),
      exercises: templates[templateName].map((name) => ({ id: makeId(), name, sets: 4, reps: 10, rest: 90 }))
    };
    setWorkouts([workout, ...workouts]);
    setActiveId(workout.id);
    setScreen('editor');
  }

  function updateExercise(exerciseId, field, value) {
    setWorkouts(workouts.map((w) => w.id !== activeId ? w : {
      ...w,
      exercises: w.exercises.map((e) => e.id !== exerciseId ? e : { ...e, [field]: value })
    }));
  }

  function deleteExercise(exerciseId) {
    setWorkouts(workouts.map((w) => w.id !== activeId ? w : {
      ...w,
      exercises: w.exercises.filter((e) => e.id !== exerciseId)
    }));
  }

  function addExercise(name) {
    if (!active) return;
    setWorkouts(workouts.map((w) => w.id !== activeId ? w : {
      ...w,
      exercises: [...w.exercises, { id: makeId(), name, sets: 3, reps: 10, rest: 60 }]
    }));
    setScreen('editor');
  }

  function renameWorkout(value) {
    if (!active) return;
    setWorkouts(workouts.map((w) => w.id === active.id ? { ...w, name: value } : w));
  }

  return (
    <main className="app">
      <header className="topbar">
        <button className="backButton" onClick={() => screen === 'home' ? null : setScreen('home')}>
          {screen === 'home' ? 'YUVAL' : 'חזרה'}
        </button>
        <div className="brand">
          <b>YUVAL FITNESS</b>
          <span>Workout Builder</span>
        </div>
      </header>

      {screen === 'home' && (
        <section className="homeScreen simpleHome">
          <div className="yuvalTitle">YUVAL</div>

          <div className="actionList cleanMenu">
            <button className="actionCard primaryCard" onClick={() => setScreen('new')}>
              <span><b>אימון חדש</b></span>
              <i>→</i>
            </button>

            <button className="actionCard" onClick={() => setScreen('workouts')}>
              <span><b>האימונים שלי</b></span>
              <i>→</i>
            </button>

            <button className="actionCard" onClick={() => setScreen('library')}>
              <span><b>ספריית תרגילים</b></span>
              <i>→</i>
            </button>

            <button className="actionCard" onClick={() => setScreen('templates')}>
              <span><b>תבניות אימון</b></span>
              <i>→</i>
            </button>

            <button className="actionCard" onClick={() => setScreen('settings')}>
              <span><b>הגדרות</b></span>
              <i>→</i>
            </button>
          </div>
        </section>
      )}

      {(screen === 'new' || screen === 'templates') && (
        <section className="panel">
          <div className="sectionHead">
            <h2>{screen === 'new' ? 'אימון חדש' : 'תבניות אימון'}</h2>
            <p>בחר תבנית. האימון ייפתח מיד לעריכה.</p>
          </div>
          {Object.keys(templates).map((t) => (
            <button className="card" key={t} onClick={() => createWorkout(t)}>
              <span>
                <b>{t}</b>
                <small>{templates[t].length} תרגילים</small>
              </span>
              <i>צור</i>
            </button>
          ))}
        </section>
      )}

      {screen === 'workouts' && (
        <section className="panel">
          <div className="sectionHead">
            <h2>האימונים שלי</h2>
            <p>פתח תוכנית קיימת והמשך לערוך.</p>
          </div>
          {workouts.length === 0 && <div className="empty"><b>אין אימונים עדיין</b><button onClick={() => setScreen('new')}>צור אימון ראשון</button></div>}
          {workouts.map((w) => (
            <button className="card" key={w.id} onClick={() => { setActiveId(w.id); setScreen('editor'); }}>
              <span>
                <b>{w.name}</b>
                <small>{w.exercises.length} תרגילים</small>
              </span>
              <i>פתח</i>
            </button>
          ))}
        </section>
      )}

      {screen === 'editor' && active && (
        <section className="editorPanel">
          <input className="title" value={active.name} onChange={(e) => renameWorkout(e.target.value)} />
          <div className="editorActions">
            <button className="primary" onClick={() => setScreen('library')}>הוסף תרגיל</button>
            <button onClick={() => window.print()}>ייצא PDF</button>
          </div>

          <div className="exerciseStack">
            {active.exercises.map((ex) => (
              <div className="row" key={ex.id}>
                <div className="rowHeader">
                  <b>{ex.name}</b>
                  <button className="danger" onClick={() => deleteExercise(ex.id)}>מחק</button>
                </div>
                <label>סטים<input value={ex.sets} onChange={(e) => updateExercise(ex.id, 'sets', e.target.value)} /></label>
                <label>חזרות<input value={ex.reps} onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)} /></label>
                <label>מנוחה<input value={ex.rest} onChange={(e) => updateExercise(ex.id, 'rest', e.target.value)} /></label>
              </div>
            ))}
          </div>

          <div className="summaryBar">
            <span>{active.exercises.length} תרגילים</span>
            <span>נשמר אוטומטית</span>
          </div>
        </section>
      )}

      {screen === 'library' && (
        <section className="panel">
          <div className="sectionHead">
            <h2>ספריית תרגילים</h2>
            <p>{active ? 'לחיצה על תרגיל תוסיף אותו לאימון.' : 'מאגר תרגילים ראשוני.'}</p>
          </div>
          <input className="search" placeholder="חיפוש" value={query} onChange={(e) => setQuery(e.target.value)} />
          {results.map((name) => (
            <button className="card" key={name} onClick={() => addExercise(name)}>
              <span><b>{name}</b><small>תרגיל</small></span>
              <i>{active ? 'הוסף' : 'צפה'}</i>
            </button>
          ))}
        </section>
      )}

      {screen === 'settings' && (
        <section className="panel">
          <div className="sectionHead">
            <h2>הגדרות</h2>
            <p>גרסת MVP מקומית. כל האימונים נשמרים במכשיר.</p>
          </div>
          <div className="settingsBox">
            <b>שם המאמן</b>
            <span>יובל</span>
          </div>
          <div className="settingsBox">
            <b>שמירה</b>
            <span>אוטומטית בדפדפן</span>
          </div>
          <div className="settingsBox">
            <b>ייצוא</b>
            <span>PDF דרך הדפסה</span>
          </div>
        </section>
      )}
    </main>
  );
}
