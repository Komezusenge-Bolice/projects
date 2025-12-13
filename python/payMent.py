def payment(hours,rate):
    fiNal = hours-5
    valUe = rate+5
    multi = 5*valUe
    pament = fiNal * rate +multi
    print(pament)
payment(float(input("passIn the time in hours: ")),float(input("passIn the rate: ")))
