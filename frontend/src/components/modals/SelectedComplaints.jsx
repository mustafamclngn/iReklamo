import "./modal.css";
import InsetCard from "../cards/insetCard";

const SelectedComplaintsList = ({ selectedComplaints, onRemove, button}) => {

    const list = Array.isArray(selectedComplaints)
        ? selectedComplaints
        : [...selectedComplaints.values()];

    
    return (
        <>
            <InsetCard>
                <label className="selected_complaints_list_label">Selected Complaints: </label>
                {(list.length > 0) ?
                    <ol className="complaints-list">
                        {list.map((complaint, index) => (
                            <li key={complaint.id} className="complaint-item">
                            <div className="complaint-row">
                                <div className="complaint-text">
                                <strong>{index + 1}. </strong>
                                <em>{complaint.complaint_code}</em>:{" "}
                                <em>{complaint.title}</em>
                                </div>
                    
                                {button && <button
                                type="button"
                                className="remove-btn"
                                onClick={() => onRemove(complaint)}
                                >
                                <i className="bi bi-dash-circle"></i>
                                </button>}
                            </div>
                            </li>
                        ))}
                        </ol> :
                        <p className="no-complaints">None</p>
                }
            </InsetCard>
        </>
    );
};

export default SelectedComplaintsList;
