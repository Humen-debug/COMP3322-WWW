import React from "react";

class DropDownList extends React.Component {
    render() {
        return (
            <div>
                <b>Choose one subject </b>
                <select
                    onChange={(e) =>
                        this.props.handleNotesChange(e.target.value)
                    }
                >
                    <option value="all">all</option>
                    <option value="science">science</option>
                    <option value="math">math</option>
                    <option value="culture">culture</option>
                </select>
            </div>
        );
    }
}

class NewNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputNoteSubject: "",
            inputNoteContent: "",
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    render() {
        return (
            <div>
                <p>
                    <b>Add a new Note:</b>
                </p>
                <input
                    type="text"
                    name="inputNoteSubject"
                    placeholder="Note Subject"
                    value={this.state.inputNoteSubject}
                    onChange={(e) => this.handleInputChange(e)}
                />

                <input
                    type="text"
                    name="inputNoteContent"
                    placeholder="Note Content"
                    value={this.state.inputNoteContent}
                    onChange={(e) => this.handleInputChange(e)}
                />

                <HintAndSubmit
                    new_subject={this.state.inputNoteSubject}
                    new_content={this.state.inputNoteContent}
                    handleNotesChange={this.props.handleNotesChange}
                    currentFilter={this.props.currentFilter}
                ></HintAndSubmit>
            </div>
        );
    }
}

class HintAndSubmit extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        let new_note = {
            subject: this.props.new_subject,
            content: `"${this.props.new_content}"`,
        };
        userNotesDB.push(new_note);
        alert("Successfully added a new note!");
        this.props.handleNotesChange(this.props.currentFilter);
    }

    render() {
        if (
            this.props.new_subject === "science" ||
            this.props.new_subject === "math" ||
            this.props.new_subject === "culture"
        ) {
            return (
                <button type="Submit" onClick={this.handleClick}>
                    Submit
                </button>
            );
        } else {
            return (
                <p>
                    Hint: Note Subject should be chosen from "science", "math",
                    and "culture"
                </p>
            );
        }
    }
}

class Lab7App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userNotes: userNotesDB,
            currentFilter: "all",
        };
        this.handleNotesChange = this.handleNotesChange.bind(this);
    }

    handleNotesChange(option) {
        if (option !== "all") {
            this.setState({
                userNotes: userNotesDB.filter(
                    (note) => note.subject === option
                ),
            });
        } else {
            this.setState({ userNotes: userNotesDB });
        }
        this.setState({ currentFilter: option });
    }

    render() {
        const userNotes = this.state.userNotes;
        return (
            <div>
                <h2>Lab7 Exercise</h2>
                <DropDownList handleNotesChange={this.handleNotesChange} />
                {userNotes.map((note) => {
                    return (
                        <p key={note.content}>
                            Note Subject:{note.subject}; Note Content:{" "}
                            {note.content}
                        </p>
                    );
                })}
                <NewNote
                    handleNotesChange={this.handleNotesChange}
                    currentFilter={this.state.currentFilter}
                />
            </div>
        );
    }
}

const userNotesDB = [
    { subject: "science", content: '"This is note 1 for science"' },
    { subject: "science", content: '"This is note 2 for science"' },
    { subject: "science", content: '"This is note 3 for science"' },
    { subject: "math", content: '"This is note 1 for math"' },
    { subject: "math", content: '"This is note 2 for math"' },
    { subject: "math", content: '"This is note 3 for math"' },
    { subject: "culture", content: '"This is note 1 for culture"' },
    { subject: "culture", content: '"This is note 2 for culture"' },
    { subject: "culture", content: '"This is note 3 for culture"' },
];

export default Lab7App;
