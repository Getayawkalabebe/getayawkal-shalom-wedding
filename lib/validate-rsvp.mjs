export function validateRsvp(d) {
  if (!d || typeof d !== 'object' || d.website)
    return { error: 'Invalid response.' };
  for (const [key, min, max] of [
    ['name', 2, 120],
    ['contact', 7, 30],
    ['message', 0, 2000],
    ['requestId', 12, 100],
  ]) {
    if (
      typeof d[key] !== 'string' ||
      d[key].trim().length < min ||
      d[key].length > max
    )
      return { error: `Please check ${key}.` };
  }
  if (
    !/^[+\d\s().-]{7,30}$/.test(d.contact) ||
    d.contact.replace(/\D/g, '').length < 7
  )
    return { error: 'Please enter a valid phone number.' };
  if (!['yes', 'no'].includes(d.attendance))
    return { error: 'Please choose whether you will attend.' };
  if (!['groom', 'bride', 'both'].includes(d.side))
    return { error: 'Please choose your side.' };
  if (
    !Number.isInteger(d.guests) ||
    (d.attendance === 'yes' ? d.guests < 1 || d.guests > 6 : d.guests !== 0)
  )
    return { error: 'Please check the number of guests.' };
  return {
    record: {
      requestId: d.requestId,
      name: d.name.trim(),
      phone: d.contact.trim(),
      attendance: d.attendance,
      guests: d.guests,
      side: d.side,
      message: d.message.trim(),
    },
  };
}
