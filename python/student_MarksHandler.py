def get_subjects():
    return [
        "physics", "biology", "chemistry", "english", "kinyarwanda",
        "entrepreneurship", "maths", "history", "geography"
    ]

def get_grade(mark):
    if mark >= 80:
        return "A"
    elif mark >= 70:
        return "B"
    elif mark >= 60:
        return "C"
    elif mark >= 50:
        return "D"
    else:
        return "F"

def get_marks_for_subjects(subjects):
    marks = {}
    for subject in subjects:
        while True:
            try:
                value = float(input(f"Enter marks for {subject}: "))
                if 0 <= value <= 100:
                    marks[subject] = value
                    break
                else:
                    print("Marks must be between 0 and 100.")
            except ValueError:
                print("Please enter a valid number.")
    return marks

def calculate_average(marks):
    total = sum(marks.values())
    count = len(marks)
    return total / count

def print_detailed_report(marks):
    print("\n" + "="*50)
    print("           DETAILED MARKS REPORT")
    print("="*50)
    
    total_marks = 0
    failed_subjects = 0
    
    # Print each subject with grade
    for subject, mark in marks.items():
        grade = get_grade(mark)
        total_marks += mark
        status = "FAIL" if grade == "F" else "PASS"
        if grade == "F":
            failed_subjects += 1
            
        print(f"{subject.capitalize():15} | {mark:5.1f} | {grade:2} | {status}")
    
    # Overall statistics
    average = calculate_average(marks)
    overall_grade = get_grade(average)
    
    print("-"*50)
    print(f"AVERAGE:              {average:.1f} | {overall_grade}")
    
    # Pass/Fail determination
    if failed_subjects > 0 or average < 50:
        print("OVERALL RESULT: ❌ FAILED")
        if failed_subjects > 0:
            print(f"Failed {failed_subjects} subject(s)")
    else:
        print("OVERALL RESULT: ✅ PASSED")
    
    print("="*50)

def main():
    subjects = get_subjects()
    marks = get_marks_for_subjects(subjects)
    print_detailed_report(marks)

main()
