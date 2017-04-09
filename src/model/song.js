import _ from "lodash"
import observable from "riot-observable"
import MeasureList from "./MeasureList"
import Track from "./Track"
import maxX from "../helpers/maxX"

export default class Song {
  constructor() {
    this._tracks = []
    this.name = "Untitled Song"
    this._selectedTrackId = 0
    this._measureList = null
    observable(this)
  }

  _emitChange() {
    this.trigger("change")
  }

  addTrack(t) {
    t.channel = t.channel || this._tracks.length
    t.on("change", () => this._emitChange())
    this._tracks.push(t)
    this.trigger("add-track", t)
    this._emitChange()
  }

  removeTrack(id) {
    _.pullAt(this._tracks, id)
    this._selectedTrackId = Math.min(id, this._tracks.length)
    this._emitChange()
  }

  selectTrack(id) {
    if (id === this.selectedTrackId) { return }
    this._selectedTrackId = id
    this._emitChange()
  }

  get selectedTrack() {
    return this._tracks[this._selectedTrackId]
  }

  get selectedTrackId() {
    return this._selectedTrackId
  }

  get tracks() {
    return this._tracks
  }

  getTrack(id) {
    return this._tracks[id]
  }

  get measureList() {
    if (this._measureList) {
      return this._measureList
    }

    this._measureList = new MeasureList(this.getTrack(0))
    return this._measureList
  }

  get endOfSong() {
    return maxX(_.flatten(this._tracks.map(t => t.getEvents())))
  }

  static emptySong() {
    const song = new Song()
    song.addTrack(Track.conductorTrack())
    song.addTrack(Track.emptyTrack(0))
    song.name = "new song.mid"
    return song
  }

  static fromMidi(midi) {
    const song = new Song
    midi.tracks.forEach(t => {
      const track = new Track
      t.events.forEach(e => {
        track.addEvent(e)
      })
      track.endOfTrack = t.end
      const chEvent = _.find(t.events, e => {
        return e.type == "channel"
      })
      track.channel = chEvent ? chEvent.channel : undefined
      song.addTrack(track)
    })
    return song
  }
}
