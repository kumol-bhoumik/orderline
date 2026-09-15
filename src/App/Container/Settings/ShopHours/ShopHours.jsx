import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TagSelect from './TagSelect';
import { X } from 'lucide-react';
const ALL_DAYS = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

const TIME_OPTIONS = (() => {
  const options = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 15) {
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMinute = minute.toString().padStart(2, '0');
      options.push(`${displayHour}:${displayMinute} ${period}`);
    }
  }
  return options;
})();

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

function summarizeHours(selectedDayIds, timePeriods) {
  if (!selectedDayIds.length) return 'No days selected';
  const dayLabel = selectedDayIds.length === 7 ? 'Every day' : ALL_DAYS.filter((d) => selectedDayIds.includes(d.id)).map((d) => d.label).join(', ');
  const timeLabel = timePeriods.map((p) => `${p.start} - ${p.end}`).join(', ');
  return `${dayLabel}\n${timeLabel}`;
}

export default function ShopHours() {
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedDayIds, setSelectedDayIds] = useState(['tuesday', 'wednesday', 'friday', 'saturday', 'sunday', 'thursday', 'monday']);
  const [startTime, setStartTime] = useState('8:00 AM');
  const [endTime, setEndTime] = useState('8:00 PM');
  const [selectedDays, setSelectedDays] = useState([]);
  const [savedHours] = useState({
    dayLabel: 'Every day',
    timeLabel: '8:00 AM - 8:00 PM, 8:30 PM - 11:45 PM',
  });

  const [data, setData] = useState([{
    open24Hours: false,
    days:[],
    time_period:{
        start_time: "12 AM",
        end_time: "11:59 PM"
    }
  }])

  const manageElement = (type, index) => {
    if(type === "add"){
        setData([
            ...data, {
                open24Hours: false,
                days:[],
                time_period:{
                    start_time: "12 AM",
                    end_time: "11:59 PM"
                }
            }
        ]);
    } else {
        if(data.length > 1){
            let newData = [...data];
            newData.splice(index, 1)
            setData(newData);
        }
    }
  }

  const handleData = (selected, key, type) => {
    if(type == "days"){
        let newData = data.map((d, index)=>{
            if(key === index){
                return {
                    ...d,
                    days: selected
                }
            }else {
                return {
                    ...d
                }
            }
        });
        setData(newData);
    } else if(type === "24hours"){
        let newData = data.map((d, index)=>{
            if(key === index){
                return {
                    ...d,
                    open24Hours: !d.open24Hours
                }
            }else {
                return {
                    ...d
                }
            }
        });
        setData(newData);
    } else if(type === "start_time"){
        console.log(selected, type, key)
        let newData = data.map((d, index)=>{
            if(key === index){
                return {
                    ...d,
                    time_period: {
                        ...d.time_period,
                        start_time: selected
                    }
                }
            }else {
                return {
                    ...d
                }
            }
        });
        setData(newData);
    } else if(type === "end_time"){
        let newData = data.map((d, index)=>{
            if(key === index){
                return {
                    ...d,
                    time_period: {
                        ...d.time_period,
                        end_time: selected
                    }
                }
            }else {
                return {
                    ...d
                }
            }
        });
        setData(newData);
    }
    console.log(data);
  }
  const removeDay = (dayId) => {
    setSelectedDayIds((prev) => prev.filter((id) => id !== dayId));
  };

  const updateTime = async() => {
    
  }


  const styles = {
    page: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#000000',
    },
    leftColumn: {
      flex: 1,
      padding: '32px 40px',
      maxWidth: 900,
    },
    headerRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 32,
    },
    backButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 4,
      display: 'flex',
      color: '#000000',
    },
    pageTitle: {
      fontSize: 34,
      fontWeight: 800,
      margin: 0,
      letterSpacing: '-0.02em',
    },
    tabRow: {
      display: 'flex',
      gap: 28,
      borderBottom: '1px solid #EDEDED',
      marginBottom: 4,
    },
    tab: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 15,
      fontWeight: 600,
      color: '#6B6B6B',
      padding: '0 0 12px 0',
      borderBottom: '2px solid transparent',
    },
    tabActive: {
      color: '#000000',
      borderBottom: '2px solid #000000',
    },
    menuRow: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '20px 0',
      borderBottom: '1px solid #EDEDED',
      cursor: 'pointer',
    },
    menuRowLabel: {
      fontSize: 16,
      fontWeight: 700,
      margin: '0 0 6px 0',
    },
    menuRowValue: {
      fontSize: 14,
      color: '#6B6B6B',
      margin: 0,
      lineHeight: 1.5,
    },
    chevronRight: {
      color: '#B5B5B5',
      marginTop: 4,
    },
    disableHint: {
      fontSize: 14,
      color: '#6B6B6B',
      marginTop: 24,
    },

    rightColumn: {
      width: 380,
      flexShrink: 0,
      padding: '32px 24px 24px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
    card: {
      border: '1px solid #E5E5E5',
      borderRadius: 12,
      padding: 20,
      marginBottom: "20px"
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 700,
      margin: '0 0 12px 0',
      flex: '1 1 84%'
    },
    daysBox: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      alignItems: 'center',
      paddingBottom: 16,
      borderBottom: '1px solid #EDEDED',
      marginBottom: 16,
    },
    dayPill: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#3D3D3D',
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: 600,
      padding: '7px 8px 7px 12px',
      borderRadius: 20,
    },
    dayPillClose: {
      background: 'none',
      border: 'none',
      color: '#FFFFFF',
      cursor: 'pointer',
      display: 'flex',
      padding: 0,
      opacity: 0.85,
    },
    dayDropdownButton: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#111111',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '50%',
      width: 26,
      height: 26,
      justifyContent: 'center',
      cursor: 'pointer',
      position: 'relative',
      marginLeft: 4,
    },
    timeRow: {
      display: 'flex',
      gap: 12,
      marginBottom: 12,
    },
    timeField: {
      flex: 1,
    },
    timeLabel: {
      fontSize: 14,
      fontWeight: 700,
      display: 'block',
      marginBottom: 8,
    },
    selectWrapper: {
      position: 'relative',
    },
    select: {
      width: '100%',
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      fontSize: 15,
      fontWeight: 500,
      padding: '10px 32px 10px 12px',
      borderRadius: 8,
      border: '1px solid #D6D6D6',
      backgroundColor: '#FFFFFF',
      color: '#000000',
      cursor: 'pointer',
    },
    selectChevron: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: '#000000',
    },
    timezoneNote: {
      fontSize: 13,
      color: '#6B6B6B',
      margin: '0 0 16px 0',
    },
    open24Row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    open24Label: {
      fontSize: 15,
      fontWeight: 700,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      border: '2px solid #000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      flexShrink: 0,
    },
    selectedCheckbox: {
        width: 20,
      height: 20,
      borderRadius: 4,
      border: '2px solid #000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0,
        backgroundColor: '#000000'
    },
    inactive: {
        backgroundColor: 'transparent'
    },
    addHoursRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    //   padding: '24px 0',
      cursor: 'pointer',
      color: '#000000',
      fontWeight: 700,
      fontSize: 15,
      background: 'none',
      border: 'none',
      width: '100%',
    },
    spacer: {
      flex: 1,
    },
    updateBarWrapper: {
      position: 'relative',
      marginTop: 12,
    },
    updateBarTag: {
      position: 'absolute',
      top: -18,
      left: 16,
      backgroundColor: '#000000',
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: 600,
      padding: '3px 8px',
      borderRadius: 4,
    },
    updateBar: {
      backgroundColor: '#000000',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: 8,
      width: '100%',
      padding: '18px 20px',
      fontSize: 16,
      fontWeight: 700,
      cursor: 'pointer',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.page}>
      {/* Left column */}
      <div style={styles.leftColumn}>
        <div style={styles.headerRow}>
          <button style={styles.backButton} aria-label="Go back">
            <Link to="/"><ChevronLeftIcon /></Link>
          </button>
          <h1 style={styles.pageTitle}>Shop hours</h1>
        </div>

        <div style={styles.tabRow}>
          <button
            style={{ ...styles.tab, ...(activeTab === 'menu' ? styles.tabActive : null) }}
            onClick={() => setActiveTab('menu')}
          >
            Menu hours
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'holiday' ? styles.tabActive : null) }}
            onClick={() => setActiveTab('holiday')}
          >
            Holiday hours
          </button>
        </div>

        {activeTab === 'menu' ? (
          <>
            <div style={styles.menuRow}>
              <div>
                <p style={styles.menuRowLabel}>Menu</p>
                <p style={styles.menuRowValue}>{savedHours.dayLabel}</p>
                <p style={styles.menuRowValue}>{savedHours.timeLabel}</p>
              </div>
              <span style={styles.chevronRight}>
                <ChevronRightIcon />
              </span>
            </div>

            <p style={styles.disableHint}>
              You can disable menu hour editing at orderline.co
            </p>
          </>
        ) : (
          <p style={styles.disableHint}>No holiday hours have been set up yet.</p>
        )}
      </div>

      {/* Right column */}
      <div style={styles.rightColumn}>
        <div style={{"overflow": "scroll",
            "max-height": "70vh"}}>
            {
                data.map((d, index)=>{
                    return (<div key={index} style={styles.card}>
                        <div className='flex'>
                            <p style={styles.cardTitle}>Select days and times</p>
                            {
                                data.length > 1 ? (<button style={{"flex": "1 1 0%", "margin": "0px 0px 12px"}} onClick={()=>manageElement("remove", index)}>
                                    <X className="h-4 w-4 text-gray-400" />
                                </button>) : null
                            }
                            
                        </div>
                        <div style={styles.daysBox}>
                            <TagSelect value={d.days} options = {ALL_DAYS} onChange={(selected)=>handleData(selected, index, "days")}/>
                        </div>

                        <div style={styles.timeRow}>
                            <div style={styles.timeField}>
                            <label style={styles.timeLabel} htmlFor="start-time">
                                Start time:
                            </label>
                            <div style={styles.selectWrapper}>
                                <select
                                id="start-time"
                                style={styles.select}
                                value={d.time_period.start_time}
                                onChange={(e) => handleData(e.target.value, index, "start_time")}
                                disabled={d.open24Hours}
                                >
                                {TIME_OPTIONS.map((t) => (
                                    <option key={t} value={t}>
                                    {t}
                                    </option>
                                ))}
                                </select>
                                <span style={styles.selectChevron}>
                                <ChevronDownIcon />
                                </span>
                            </div>
                            </div>

                            <div style={styles.timeField}>
                            <label style={styles.timeLabel} htmlFor="end-time">
                                End time:
                            </label>
                            <div style={styles.selectWrapper}>
                                <select
                                id="end-time"
                                style={styles.select}
                                value={d.time_period.end_time}
                                onChange={(e) => handleData(e.target.value, index, "end_time")}
                                disabled={d.open24Hours}
                                >
                                {TIME_OPTIONS.map((t) => (
                                    <option key={t} value={t}>
                                    {t}
                                    </option>
                                ))}
                                </select>
                                <span style={styles.selectChevron}>
                                <ChevronDownIcon />
                                </span>
                            </div>
                            </div>
                        </div>

                        <p style={styles.timezoneNote}>Time will be in your shop's local time zone.</p>

                        <div style={styles.open24Row}>
                            <span style={styles.open24Label}>Open 24 hours</span>
                            <div
                            style= {d.open24Hours ? styles.selectedCheckbox : styles.checkbox }
                            role="checkbox"
                            aria-checked={d.open24Hours}
                            tabIndex={0}
                            onClick={() => handleData(d.open24Hours, index, "24hours")}
                            >
                            {d.open24Hours && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M20 6L9 17l-5-5"
                                    stroke="#FFFFFF"
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                </svg>
                            )}
                            </div>
                        </div>
                    </div>)
                })
            }

            <button onClick={()=>manageElement("add")} style={styles.addHoursRow}>
            <PlusIcon />
            Add menu hours
            </button>
        </div>

        <div style={styles.spacer} />

        <div style={styles.updateBarWrapper}>
          <button
            style={styles.updateBar}
            onClick={() => updateTime()}
          >
            Update menu hours
          </button>
        </div>
      </div>
    </div>
  );
}