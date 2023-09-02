import React, { Component } from "react";
import "./RuleRow.css";

class RuleRow extends Component {
  render() {
    const { score, name, doScore, description } = this.props;
    const isActive = score === undefined;
    const disabled = !isActive;

    return (
      <tr
        className={`RuleRow RuleRow-${isActive ? "active" : "disabled"}`}
        onClick={disabled ? null : doScore}
      >
        <td className="RuleRow-name">{name}</td>
        <td className="RuleRow-score">{disabled ? score : description}</td>
      </tr>
    );
  }
}

export default RuleRow;
