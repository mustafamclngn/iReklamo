import "./modal.css";

const SelectedComplaintsList = ({ selectedComplaints, onRemove, button}) => {

    const list = Array.isArray(selectedComplaints)
        ? selectedComplaints
        : [...selectedComplaints.values()];

    return (
        <div className="form-group">
            <label>Selected Complaints</label>
            <div className="user-summary">
                {(list.length > 0) ?
                    <ol style={{paddingLeft: '1.2rem', margin: 0}}>
                        {list.map((complaint, index) => (
                            <li key={complaint.id} style={{marginBottom: '0.25rem'}}>
                                <div className="row" style={{justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                    <div style={{flex: 1, wordBreak: 'break-word'}}>
                                        <strong>{index + 1}. </strong>
                                        <em>{complaint.complaint_code}</em>:{" "}
                                        <em>{complaint.title}</em>
                                    </div>
                        
                                    {button && (
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => onRemove(complaint)}
                                            title="Remove"
                                        >
                                            <i className="bi bi-dash-circle"></i>
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol> :
                    <p className="no-complaints">None selected</p>
                }
            </div>
        </div>
    );
};

export default SelectedComplaintsList;